import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";
import {thunderArt} from "../application/thunderfighter-art.ts";
import { makeDeckWithJokers } from "../core/cards.ts";
import {
  thunderfighterEngine, THUNDERFIGHTER_GAME_ID, THUNDERFIGHTER_RULES_VERSION,
  getThunderfighterResult, getSearchPresentation, getFigurePlacementOptions,
  type ThunderfighterState, type ThunderfighterAction,
} from "../games/gridcannon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";
import { resumeRegisteredGame } from "../application/registered-save-migrations.ts";
import { storageRecoveryMessage } from "../application/storage-recovery-messages.ts";
import { createTutorialSession } from "../application/learning.ts";
import { makeThunderfighterSummary, replayFinishedGame } from "../application/game-results.ts";
import GameResultPanel from "./GameResultPanel.tsx";
import { playGameplayEffect } from "../application/audio.ts";
import type {Locale} from "../i18n/language.ts";
import {thunderCardView} from "../application/thunderfighter-card-view.ts";
import {ThunderTacticalCard,ThunderCardDetail} from "./ThunderfighterCard.tsx";
import {contextualThunderTarget,contextualThunderActions,specialThunderActions,isThunderActionLegal,type BoardTarget,type SpecialSelection} from "../application/thunderfighter-targets.ts";

type Session = Pick<PersistentGameSession<ThunderfighterState, ThunderfighterAction>, "getState" | "getLegalActions" | "dispatch">;
const inventory = new Map(makeDeckWithJokers().map(card => [card.id, card]));
const suits = { hearts: ["♥", "Cœur"], diamonds: ["♦", "Carreau"], clubs: ["♣", "Trèfle"], spades: ["♠", "Pique"] } as const;
const options = { gameId: THUNDERFIGHTER_GAME_ID, rulesVersion: THUNDERFIGHTER_RULES_VERSION, formatVersion: 1 };
const phaseLabels: Record<ThunderfighterState["phase"], string> = {
  "initial-figures": "Positionnement initial des adversaires", "replacement-offer": "Remplacement facultatif",
  "replacement-draw": "Pioche de remplacement", "replacement-figures": "Placement des adversaires révélés",
  "placing-figure": "Placement d'un adversaire", playing: "Tour de jeu", searching: "Recherche d'un adversaire",
};
function valueOf(id: string): number {
  const card = inventory.get(id);
  return card && "rank" in card ? card.rank : 10;
}
function labelOf(id: string): string {
  const card = inventory.get(id);
  if (!card) return id;
  if ("kind" in card) return `Joker ${id.slice(-1)} · Réaffectation`;
  const rank = ({ 1: "As", 11: "Valet", 12: "Dame", 13: "Roi" } as Record<number, string>)[card.rank] ?? String(card.rank);
  return `${rank} de ${suits[card.suit][1]} (${suits[card.suit][0]})`;
}
function actionLabel(action: ThunderfighterAction): string {
  switch (action.type) {
    case "place-figure": return `Positionner en secteur ${action.slot + 1}`;
    case "skip-replacement": return "Conserver la grille initiale";
    case "start-replacement": return `Remplacer la pile ${action.cell + 1}`;
    case "draw-replacement": return "Piocher le remplacement";
    case "draw-card": return "Piocher une carte";
    case "place-number": return `Poser sur la pile ${action.cell + 1}`;
    case "extract": return `Extraction avec ${labelOf(action.cardId)} : pile ${action.cell + 1}`;
    case "reassign": return `Réaffectation avec ${labelOf(action.cardId)} : pile ${action.from + 1} → ${action.to + 1}`;
    case "draw-search": return "Révéler la prochaine carte de recherche";
    case "assign-armor": return `Attribuer l'armure à ${labelOf(action.figureId)}`;
  }
}
function resistance(state: ThunderfighterState, id: string): number {
  return valueOf(id) + (state.armorCards ?? []).filter(a => a.figureId === id)
    .reduce((sum, armor) => sum + valueOf(armor.cardId), 0);
}
export function previewThunderfighterAction(state: ThunderfighterState, action: ThunderfighterAction) {
  if(!isThunderActionLegal(thunderfighterEngine.getLegalActions(state),action))return {accepted:false as const,message:"Action non autorisée."};
  if(action.type==="draw-search"||action.type==="draw-card"||action.type==="draw-replacement")return {accepted:true as const,message:actionLabel(action),resultingShots:[],resultingOutcome:state.outcome,changingCards:true};
  const snapshot = structuredClone(state);
  const next = thunderfighterEngine.transition(snapshot, action);
  if (!next.accepted) return { accepted: false as const, message: "Action non autorisée." };
  const before = getThunderfighterResult(state);
  const after = getThunderfighterResult(next.state);
  const shots = (next.state.defeatedFigures ?? []).filter(id => !(state.defeatedFigures ?? []).includes(id));
  const armor = action.type === "assign-armor" ? `Armure : ${labelOf(action.figureId)}, résistance ${resistance(state, action.figureId)} → ${resistance(next.state, action.figureId)}.` : "";
  const removal = action.type === "extract" ? `Pile ${action.cell + 1} retirée et placée sous la pioche (${state.grid[action.cell].length} carte(s)).` : "";
  const relocated = action.type === "reassign" ? `Carte supérieure déplacée de ${action.from + 1} vers ${action.to + 1}.` : "";
  const replacement = action.type === "start-replacement" ? "La carte supérieure sera mise sous la pioche ; ce choix est définitif." : "";
  const hasDouble = shots.length > 1;
  const outcome = after.outcome === "win" ? `Victoire, score officiel : ${after.officialScore}.` :
    after.outcome === "loss" ? `Défaite : ${after.reason === "armor" ? "armure excessive" : "impasse"}.` : "";
  return {
    accepted: true as const,
    message: [actionLabel(action), replacement, removal, relocated, armor,
      shots.length ? `${hasDouble ? "Double tir" : "Tir"} : ${shots.map(labelOf).join(" et ")} neutralisé(s).` : "",
      outcome, `Adversaires neutralisés : ${before.defeatedCount} → ${after.defeatedCount}.`]
      .filter(Boolean).join(" "),
    resultingShots: shots, resultingOutcome: after.outcome,
    changingCards: after.physicalCardCount === 54,
  };
}
export default function ThunderfighterBoard({ tutorial = false, hintsEnabled = true, onReplayTutorial, language="fr" }: { tutorial?: boolean; hintsEnabled?: boolean; onReplayTutorial?: () => void; language?:Locale }) {
  const session = useRef<Session | null>(null);
  const [state, setState] = useState<ThunderfighterState | null>(null);
  const [legal, setLegal] = useState<readonly ThunderfighterAction[]>([]);
  const [selection, setSelection] = useState<ThunderfighterAction | null>(null);
  const [busy, setBusy] = useState(true);
  const [effect,setEffect]=useState<{kind:string;serial:number}|null>(null);
  const effectSerial=useRef(0);
  const committing=useRef(false);
  const actionTrigger=useRef<HTMLElement|null>(null);
  const confirmButton=useRef<HTMLButtonElement>(null);
  const [targetChoice,setTargetChoice]=useState<BoardTarget|null>(null);
  const [special,setSpecial]=useState<SpecialSelection|null>(null);
  const searchDialog=useRef<HTMLDialogElement>(null);
  const drag=useRef<{id:string;pointer:number;x:number;y:number;active:boolean;context:SpecialSelection|null;origin:HTMLElement}|null>(null);
  const [ghost,setGhost]=useState<{id:string;x:number;y:number;returning?:boolean}|null>(null);
  const suppressClick=useRef(false);
  const returnTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(returnTimer.current!==null)clearTimeout(returnTimer.current);},[]);
  const specialTrigger=useRef<HTMLButtonElement|null>(null);
  const en=language==="en";
  useEffect(()=>{if(selection)confirmButton.current?.focus();},[selection]);
  function cancelSelection(){setSelection(null);setTargetChoice(null);setSpecial(null);const trigger=special?specialTrigger.current:actionTrigger.current;requestAnimationFrame(()=>trigger?.isConnected&&trigger.focus());}
  const [inspected,setInspected]=useState<string|null>(null);
  const inspectTrigger=useRef<HTMLElement|null>(null);
  function closeInspect(){setInspected(null);requestAnimationFrame(()=>inspectTrigger.current?.focus());}
  const [notice, setNotice] = useState("Chargement de Thunderfighter…");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (tutorial) {
          const practice = createTutorialSession(thunderfighterEngine, { seed: 3201 });
          if (cancelled) return;
          session.current = practice;
          setState(practice.getState());
          setLegal(practice.getLegalActions());
          setNotice("Mission guidée · vos coups ne sont pas sauvegardés.");
          return;
        }
        const restored = await resumeRegisteredGame(thunderfighterEngine, createIndexedDbGameStorage(), options);
        if (cancelled) return;
        session.current = restored ?? null;
        setState(restored?.getState() ?? null);
        setLegal(restored?.getLegalActions() ?? []);
        setNotice(restored ? "" : "Commencez une partie.");
      } catch (error) {
        if (!cancelled) setNotice(storageRecoveryMessage(error, "read"));
      } finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [tutorial]);
  async function start() {
    if (busy || session.current) return;
    setBusy(true);
    try {
      const created = await startPersistentGame(thunderfighterEngine, createIndexedDbGameStorage(),
        { ...options, sessionId: crypto.randomUUID() }, { seed: Math.floor(Math.random() * 0x100000000) });
      session.current = created;
      setState(created.getState());
      setLegal(created.getLegalActions());
      setNotice("");
    } catch (error) { setNotice(storageRecoveryMessage(error, "start")); }
    finally { setBusy(false); }
  }
  async function replay() {
    if (busy || !state || state.outcome === "in-progress") return;
    if (tutorial) { onReplayTutorial?.(); return; }
    setBusy(true);
    try {
      const restored = await replayFinishedGame(
        thunderfighterEngine, createIndexedDbGameStorage(), options,
        { seed: Math.floor(Math.random() * 0x100000000) }, crypto.randomUUID(),
      );
      session.current = restored;
      setState(restored.getState());
      setLegal(restored.getLegalActions());
      setSelection(null);setSpecial(null);setTargetChoice(null);
      setNotice("Nouvelle mission enregistrée. Bonne chance !");
    } catch {
      setNotice("Impossible de rejouer : la sauvegarde a peut-être changé. Aucune partie active n'a été abandonnée.");
    } finally { setBusy(false); }
  }
  function choose(action: ThunderfighterAction) {
    if (busy || committing.current || !isThunderActionLegal(legal,action)) return;
    if(!targetChoice)actionTrigger.current=document.activeElement as HTMLElement;
    setTargetChoice(null);
    setSelection(action);
  }
  async function confirm() {
    if (busy || committing.current || !selection || !session.current || !state) return;
    if (!isThunderActionLegal(session.current.getLegalActions(),selection)) {
      setLegal(session.current.getLegalActions());setSpecial(null);setTargetChoice(null);setSelection(null);
      setNotice("Cette action n'est plus autorisée.");
      return;
    }
    committing.current=true;
    setBusy(true);
    try {
      const result = await session.current.dispatch(selection);
      if (!result.accepted) setNotice("Action refusée : " + result.reason);
      else {
        const nextResult = getThunderfighterResult(result.state);
        const shots = (result.state.defeatedFigures??[]).filter(id=>!(state.defeatedFigures??[]).includes(id));
        setState(result.state);
        setLegal(session.current.getLegalActions());
        const effectKind=nextResult.outcome==="win"?"victory":nextResult.outcome==="loss"?"defeat":shots.length?"shot":selection.type==="assign-armor"?"armor":selection.type==="extract"||selection.type==="reassign"?"special":"place";
        setEffect({kind:effectKind,serial:++effectSerial.current});
        playGameplayEffect(effectKind);
        setNotice(nextResult.outcome === "win" ? `Victoire ! Score : ${nextResult.officialScore}.` :
          nextResult.outcome === "loss" ? `Défaite : ${nextResult.reason === "armor" ? "armure excessive" : "impasse"}.` :
          shots.length ? `${shots.length > 1 ? "Double tir" : "Tir"} : ${shots.map(labelOf).join(" et ")}.` :
          `${tutorial ? "Coup d’entraînement" : "Coup enregistré"} : ${actionLabel(selection)}.`);
      }
      setSelection(null);setSpecial(null);setTargetChoice(null);
    } catch (error) { setNotice(storageRecoveryMessage(error, "write")); }
    finally { committing.current=false;setBusy(false); }
  }
  const preview = state && selection ? previewThunderfighterAction(state, selection) : null;
  const figures = state?.figureSlots ?? [];
  const selectedTarget=selection?contextualThunderTarget(selection,figures,special):targetChoice;
  const fallbackActions=special?[]:legal.filter(action=>!contextualThunderTarget(action,figures,null)&&action.type!=="extract"&&action.type!=="reassign");
  const ambiguousActions=targetChoice?contextualThunderActions(legal,figures,special,targetChoice.kind,targetChoice.index):[];
  const activeSpecial=special?specialThunderActions(legal,special.cardId):[];
  const choosingSource=!!special&&special.from===undefined&&activeSpecial.some(a=>a.type==="reassign");
  function selectTarget(kind:BoardTarget["kind"],index:number,context:SpecialSelection|null,trigger:HTMLElement){
    if(busy||committing.current)return false;
    const actions=contextualThunderActions(legal,figures,context,kind,index);
    if(!actions.length)return false;
    setSpecial(context);actionTrigger.current=trigger;
    if(context&&context.from===undefined&&actions.some(a=>a.type==="reassign")){
      setSelection(null);setTargetChoice(null);setSpecial({...context,from:index});return true;
    }
    if(actions.length===1){setSelection(actions[0]);setTargetChoice(null);}
    else{setSelection(null);setTargetChoice({kind,index});}
    return true;
  }
  function renderTarget(kind:BoardTarget["kind"],index:number){
    const actions=contextualThunderActions(legal,figures,special,kind,index);
    if(!actions.length)return null;
    const selected=selectedTarget?.kind===kind&&selectedTarget.index===index;
    const label=(en?(kind==="pile"?(choosingSource?"Select source pile ":"Select pile "):"Select sector "):(kind==="pile"?(choosingSource?"Sélectionner la pile source ":"Sélectionner la pile "):"Sélectionner le secteur "))+(index+1);
    return <button type="button" data-i18n-ignore className="tf-target" data-target-kind={kind} data-target-index={index} aria-label={label} aria-pressed={selected} disabled={busy} onClick={event=>selectTarget(kind,index,special,event.currentTarget)}><span aria-hidden="true">{selected?"✓":"+"}</span></button>;
  }
  function startDrag(event:ReactPointerEvent<HTMLElement>,id:string,context:SpecialSelection|null){
    if(busy||committing.current||!event.isPrimary||event.button!==0||drag.current)return;
    if(!(event.target as Element).closest(".tf-tactical"))return;
    if(!legal.some(a=>contextualThunderTarget(a,figures,context)))return;
    if(returnTimer.current!==null)clearTimeout(returnTimer.current);
    setGhost(null);suppressClick.current=false;
    drag.current={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,active:false,context,origin:event.currentTarget};
  }
  function moveDrag(event:ReactPointerEvent<HTMLElement>){
    const g=drag.current;if(!g||g.pointer!==event.pointerId)return;
    if(!g.active&&Math.hypot(event.clientX-g.x,event.clientY-g.y)<7)return;
    if(!g.active){g.active=true;g.origin.setPointerCapture(event.pointerId);setSpecial(g.context);setSelection(null);setTargetChoice(null);if(g.context)specialTrigger.current=g.origin.querySelector("button.tf-special-use");}
    event.preventDefault();setGhost({id:g.id,x:event.clientX,y:event.clientY});
  }
  function finishDrag(event:ReactPointerEvent<HTMLElement>,cancel=false){
    const g=drag.current;if(!g||g.pointer!==event.pointerId)return;
    drag.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(!g.active)return;
    suppressClick.current=true;
    const cell=cancel?null:document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>("[data-tf-kind][data-tf-index]");
    const kind=cell?.dataset.tfKind,index=Number(cell?.dataset.tfIndex);
    if(cell&&(kind==="pile"||kind==="sector")&&selectTarget(kind,index,g.context,g.origin.querySelector("button.tf-tactical")??g.origin)){setGhost(null);}
    else{setSpecial(null);setSelection(null);setTargetChoice(null);const rect=g.origin.querySelector("button.tf-tactical")?.getBoundingClientRect()??g.origin.getBoundingClientRect();setGhost({id:g.id,x:rect.left+rect.width/2,y:rect.top+rect.height/2,returning:true});returnTimer.current=setTimeout(()=>setGhost(null),190);}
  }
  function dragHandlers(id:string,context:SpecialSelection|null){return {onPointerDown:(e:ReactPointerEvent<HTMLElement>)=>startDrag(e,id,context),onPointerMove:moveDrag,onPointerUp:(e:ReactPointerEvent<HTMLElement>)=>finishDrag(e),onPointerCancel:(e:ReactPointerEvent<HTMLElement>)=>finishDrag(e,true),onLostPointerCapture:(e:ReactPointerEvent<HTMLElement>)=>finishDrag(e,true),onPointerLeave:(e:ReactPointerEvent<HTMLElement>)=>{if(drag.current&&!drag.current.active)finishDrag(e,true);},onClickCapture:(e:ReactMouseEvent<HTMLElement>)=>{if(suppressClick.current&&e.detail!==0){suppressClick.current=false;e.preventDefault();e.stopPropagation();}}};}
  const previewId=selection?.type==="place-number"||selection?.type==="assign-armor"?state?.pendingNumeric:selection?.type==="place-figure"?state?.pendingFigures[0]:selection?.type==="reassign"?state?.grid[selection.from]?.at(-1):null;
  function renderPreview(kind:BoardTarget["kind"],index:number){return previewId&&selectedTarget?.kind===kind&&selectedTarget.index===index?<img className="tf-drop-preview" src={thunderArt[previewId]} alt="" aria-hidden="true"/>:null;}
  function targetState(kind:BoardTarget["kind"],index:number){if(kind==="pile"&&special?.from===index)return "source";return selectedTarget?.kind===kind&&selectedTarget.index===index?"selected":contextualThunderActions(legal,figures,special,kind,index).length?"legal":undefined;}
  const result = state ? getThunderfighterResult(state) : null;
  const search = state ? getSearchPresentation(state) : null;
  const placement = state && state.pendingFigures.length ? getFigurePlacementOptions(state) : null;
  const revealed=search?.visible?search.revealedNumerics:[];
  const detail=state&&inspected?thunderCardView(state,inspected,language,revealed):null;
  function renderCard(id:string){const view=state?thunderCardView(state,id,language,revealed):null;return view?<ThunderTacticalCard key={id} card={view} locale={language} onInspect={()=>{inspectTrigger.current=document.activeElement as HTMLElement;setInspected(id);}}/>:null;}
  return <section className={`thunder-board${tutorial?" tf-training":""}${state?.outcome==="in-progress"?" tf-live":""}`} aria-labelledby="thunder-title" onKeyDown={event=>{if(event.key==="Escape"&&!event.defaultPrevented&&(selection||targetChoice||special)&&!inspected){event.preventDefault();event.stopPropagation();if(!busy)cancelSelection();}}}>
    <h2 id="thunder-title" className="thunder-sr-only">Poste de commandement</h2>
    {!state?<p className="thunder-notice" role="status" aria-live="polite">{notice}</p>:null}
    {tutorial && state ? <section className="learning-lesson" aria-label="Mission Thunderfighter">
      <h3>Mission d'entraînement · {phaseLabels[state.phase]}</h3>
      <p>{state.outcome !== "in-progress" ? "Mission terminée : vous pouvez recommencer l'entraînement ou jouer librement." :
        state.pendingFigures.length ? "Placez la figure dans un des secteurs proposés. Les emplacements sont déterminés par la ressemblance avec les cartes visibles." :
        state.phase === "replacement-offer" ? "Vous pouvez garder les neuf piles initiales ou remplacer une carte : testez les deux options en recommençant l'exercice." :
        state.phase === "replacement-draw" ? "La carte initiale est sous la pioche. Révélez le remplacement puis placez les figures éventuellement rencontrées." :
        state.phase === "searching" ? "Toutes les figures actuellement en jeu ont été vaincues : cherchez la prochaine figure, sans dévoiler les cartes suivantes." :
        state.pendingNumeric ? "Examinez les neuf piles : votre carte doit être au moins aussi forte que le sommet. Prévisualisez un tir avant de confirmer." :
        "Piochez une carte ; observez les éventuelles figures et cartes spéciales. Un As extrait une pile ; un Joker réaffecte une carte supérieure."}</p>
      <p>Objectif : comprendre les placements, les résistances, les tirs sur deux axes et la réserve spéciale. </p>
    </section> : null}
    {hintsEnabled && state ? <details className="learning-context" open={tutorial}>
      <summary>Aide sur les actions autorisées ({legal.length})</summary>
      <p>{legal.filter(a => a.type === "place-number").length} destination(s) numériques, {legal.filter(a => a.type === "place-figure").length} secteur(s) pour figure, {legal.filter(a => a.type === "extract" || a.type === "reassign").length} action(s) spéciale(s).</p>
      <p>Les Valets demandent 11 points, les Dames 12 avec la même couleur, les Rois 13 avec la même enseigne. Le score officiel ne dépend que de la réserve inutilisée en cas de victoire.</p>
    </details> : null}
    {!state ? <button type="button" className="primary-action" onClick={() => void start()} disabled={busy}>Commencer une partie</button> : <>
      <div className="thunder-metrics">
        <span><small>Pioche</small><strong>{state.drawPile.length}</strong></span>
        <span><small>Ennemis neutralisés</small><strong>{result?.defeatedCount} / 12</strong></span>
        <span><small>Réserve</small><strong>{state.specialReserve.length}</strong></span>
      </div>
      {state.outcome !== "in-progress" ? <GameResultPanel summary={makeThunderfighterSummary(state)!} tutorial={tutorial} onReplay={() => void replay()} disabled={busy} /> : null}
      <div className="tf-combat-layout">
      <h3 className="thunder-sr-only">Champ de bataille · 3 × 3</h3>
      <div className="thunder-battlefield" data-ready="true">
        {effect?<span key={effect.serial} className="tf-battle-effect" data-effect={effect.kind} aria-hidden="true"/>:null}
        <div className="thunder-top-slots">{figures.slice(0, 3).map((id, i) => <div key={i} className="thunder-slot" data-tf-kind="sector" data-tf-index={i} data-target-state={targetState("sector",i)}><small>Nord {i + 1}</small>{id ? renderCard(id) : <span className="tf-empty" aria-label="Libre">·</span>}{renderPreview("sector",i)}{renderTarget("sector",i)}</div>)}</div>
        <div className="thunder-middle">
          <div className="thunder-side-slots">{[11, 10, 9].map(i => <div className="thunder-slot" key={i} data-tf-kind="sector" data-tf-index={i} data-target-state={targetState("sector",i)}><small>Ouest {i - 8}</small>{figures[i] ? renderCard(figures[i]!) : <span className="tf-empty" aria-label="Libre">·</span>}{renderPreview("sector",i)}{renderTarget("sector",i)}</div>)}</div>
          <div className="thunder-grid">{state.grid.map((pile, i) => <div className="thunder-pile" key={i} data-tf-kind="pile" data-tf-index={i} data-target-state={targetState("pile",i)}>
            {pile.length>1?<strong aria-label={`Pile ${i + 1} · ${pile.length} carte(s)`}>×{pile.length}</strong>:null}
            {pile.length ? renderCard(pile[pile.length - 1]) : <span aria-label="Emplacement vide">—</span>}{renderPreview("pile",i)}{renderTarget("pile",i)}
          </div>)}</div>
          <div className="thunder-side-slots">{[3, 4, 5].map(i => <div className="thunder-slot" key={i} data-tf-kind="sector" data-tf-index={i} data-target-state={targetState("sector",i)}><small>Est {i - 2}</small>{figures[i] ? renderCard(figures[i]!) : <span className="tf-empty" aria-label="Libre">·</span>}{renderPreview("sector",i)}{renderTarget("sector",i)}</div>)}</div>
        </div>
        <div className="thunder-bottom-slots">{[8, 7, 6].map(i => <div className="thunder-slot" key={i} data-tf-kind="sector" data-tf-index={i} data-target-state={targetState("sector",i)}><small>Sud {i - 5}</small>{figures[i] ? renderCard(figures[i]!) : <span className="tf-empty" aria-label="Libre">·</span>}{renderPreview("sector",i)}{renderTarget("sector",i)}</div>)}</div>
      </div>
      </div>
      <div className="thunder-action-zone" data-console-phase={selection?"confirm":special?"special":state.phase==="searching"?"search":state.pendingNumeric||state.pendingFigures.length?"place":"draw"}>
<div className="tf-current-card">      {state.pendingFigures[0] ? <div className="tf-pending-card tf-drag-source" {...dragHandlers(state.pendingFigures[0],null)}>{renderCard(state.pendingFigures[0])}<p className="thunder-pending">Figure à positionner : <strong>{labelOf(state.pendingFigures[0])}</strong>. {placement?.mode === "rescue" ? "Choisissez un secteur disponible." : ""}</p></div> : null}
      {state.pendingNumeric ? <div className="tf-pending-card tf-drag-source" {...dragHandlers(state.pendingNumeric,null)}>{renderCard(state.pendingNumeric)}<p className="thunder-pending">Carte piochée : <strong>{labelOf(state.pendingNumeric)}</strong>.</p></div> : null}
</div>
      <div className="tf-console-controls">
      <section hidden={!state.specialReserve.length} className="tf-special-console" aria-label={en?"Special reserve":"Réserve spéciale"} data-i18n-ignore>
        <h3 className="thunder-sr-only">{en?"Special reserve":"Réserve spéciale"} · {state.specialReserve.length}</h3>
        {state.specialReserve.length>0?<div className="tf-special-list">{state.specialReserve.map(id=>{const view=thunderCardView(state,id,language,revealed);const available=specialThunderActions(legal,id).length>0;return <div key={id} className="tf-special-unit tf-drag-source" {...dragHandlers(id,special?.cardId===id?special:{cardId:id})}>{renderCard(id)}<button type="button" className="secondary-action tf-special-use" data-special-id={id} aria-label={(en?"Use ":"Utiliser ")+(view?.label??"")} aria-pressed={special?.cardId===id} disabled={busy||!available} onClick={event=>{specialTrigger.current=event.currentTarget;setSelection(null);setTargetChoice(null);setSpecial({cardId:id});}}>{view?.rank===1?(en?"Extract":"Extraire"):(en?"Move":"Déplacer")}</button></div>;})}</div>:null}
        
        {special&&!selection?<div className="tf-special-instruction"><p>{choosingSource?(en?"Choose the source pile.":"Choisissez la pile source."):special.from!==undefined?(en?"Choose the destination for pile ":"Choisissez la destination de la pile ")+(special.from+1):en?"Choose the pile to extract.":"Choisissez la pile à extraire."}</p><button type="button" className="back-link" disabled={busy} onClick={cancelSelection}>{en?"Cancel special action":"Annuler l’action spéciale"}</button></div>:null}
      </section>
      {search?.visible ? <section className="thunder-search" aria-label="Recherche">
        <button type="button" className="secondary-action tf-search-history" data-i18n-ignore onClick={()=>searchDialog.current?.showModal()}>{en?"Revealed cards":"Cartes révélées"} · {search.revealedNumerics.length}</button>
        <dialog ref={searchDialog} className="tf-help-dialog" aria-label={en?"Revealed cards":"Cartes révélées"}><button type="button" className="tf-dialog-close" data-i18n-ignore onClick={()=>searchDialog.current?.close()}>{en?"Close":"Fermer"}</button><p data-i18n-ignore>{en?"Revealed cards return to the bottom of the deck.":"Les cartes révélées seront replacées sous la pioche."}</p><div className="thunder-reserve tf-search-cards">{search.revealedNumerics.map(id => renderCard(id))}</div></dialog>
        {search.integrityStatus === "invalid" ? <p role="alert">La partie ne peut pas continuer normalement.</p> : null}
      </section> : null}
      <h3 className="thunder-sr-only">Actions autorisées</h3>
      {state.outcome === "in-progress" && !selection && (targetChoice||fallbackActions.length>0||legal.length===0) ? <div className="thunder-actions">
        
        {targetChoice?<div className="tf-target-choices"><p data-i18n-ignore>{en?"Choose an action":"Choisissez une action"}</p>{ambiguousActions.map((action,index)=><button type="button" className="secondary-action" key={index} disabled={busy} onClick={()=>choose(action)}>{actionLabel(action)}</button>)}<button type="button" className="back-link" onClick={cancelSelection}>{en?"Cancel":"Annuler"}</button></div>:null}
        {legal.length ? fallbackActions.map((action, index) =>
          <button type="button" className="secondary-action" key={index} disabled={busy} onClick={() => choose(action)}>{action.type==="draw-search"?<span data-i18n-ignore>{en?"Reveal next card":"Révéler la prochaine carte"}</span>:actionLabel(action)}</button>
        ) : <p>Aucune action disponible.</p>}
      </div> : null}
      </div>
      <div className="thunder-confirm" hidden={!selection&&!state.pendingNumeric&&!state.pendingFigures.length} role="group" aria-label={en?"Preview":"Prévisualisation"} data-selected={!!selection}>
        <p className="tf-preview-line" aria-live="polite">{selection&&preview?preview.message:!special&&(state.pendingNumeric||state.pendingFigures.length)?<span data-i18n-ignore>{en?"Drag the card or select a highlighted destination.":"Glissez la carte ou sélectionnez une destination."}</span>:null}</p>
        <button type="button" className="back-link" disabled={busy||!selection} onClick={cancelSelection} data-i18n-ignore>{en?"Cancel":"Annuler"}</button>
        <button ref={confirmButton} type="button" className="primary-action" disabled={busy || !selection || !preview?.accepted} onClick={() => void confirm()} data-i18n-ignore>{en?"Confirm":"Confirmer"}</button>
      </div>
      <p className="thunder-notice" role="status" aria-live="polite">{notice}</p>
      </div>

    </>}
    {ghost?<img className={`tf-drag-ghost${ghost.returning?" returning":""}`} src={thunderArt[ghost.id]} style={{left:ghost.x,top:ghost.y}} alt="" aria-hidden="true"/>:null}
    {detail?<ThunderCardDetail card={detail} locale={language} onClose={closeInspect}/>:null}
  </section>;
}
