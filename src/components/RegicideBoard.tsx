import {useEffect,useRef,useState} from 'react';
import type {Locale} from '../i18n/language.ts';
import {regicideEngine,inspectRegicide,previewRegicide,type RegicideAction,type RegicideState} from '../games/regicide/engine.ts';

import {createIndexedDbGameStorage} from '../adapters/indexeddb-game-storage.ts';
import {startRegicide,resumeRegicide,getRegicideNewGameChoice,confirmRegicideNewGame} from '../games/regicide/persistence.ts';
import type {NewGameChoice} from '../application/new-game-choice.ts';
import type {PersistentGameSession} from '../application/persistent-game-session.ts';
import {practiceRegicide,type RegicideLesson} from '../games/regicide/tutorial.ts';
import RegicideRulebook from './RegicideRulebook.tsx';

export default function RegicideBoard({language,hintsEnabled=true,lesson}:{language:Locale;hintsEnabled?:boolean;lesson?:RegicideLesson}){
 const tr=(fr:string,en:string)=>language==='fr'?fr:en;
 const [state,setState]=useState<RegicideState|null>(null);
 const [selected,setSelected]=useState<string[]>([]);
 const [pending,setPending]=useState<RegicideAction|null>(null);
 const [error,setError]=useState(false);
 const [restart,setRestart]=useState(false);
 const confirmRef=useRef<HTMLButtonElement>(null);
 const actionRef=useRef<HTMLHeadingElement>(null);
 const lock=useRef(false);
 const session=useRef<Pick<PersistentGameSession<RegicideState,RegicideAction>,'getState'|'dispatch'>|null>(null);
 const replacement=useRef<NewGameChoice|null>(null);
 const mounted=useRef(false);
 const [busy,setBusy]=useState(true);
 const [blocked,setBlocked]=useState(false);
 const [storageError,setStorageError]=useState(false);
 const [resumed,setResumed]=useState(false);
 const [showRules,setShowRules]=useState(false);
 useEffect(()=>{let cancelled=false;mounted.current=true;
  void(async()=>{try{const existing=lesson?practiceRegicide(lesson):await resumeRegicide(createIndexedDbGameStorage());if(cancelled)return;session.current=existing??null;setState(existing?.getState()??null);setResumed(!!existing&&!lesson);}catch{if(!cancelled){setBlocked(true);setStorageError(true);}}finally{if(!cancelled)setBusy(false);}})();
  return()=>{cancelled=true;mounted.current=false;};
 },[lesson]);
 async function run(work:()=>Promise<void>){if(lock.current||busy||blocked)return;lock.current=true;setBusy(true);setStorageError(false);try{await work();}catch{if(mounted.current)setStorageError(true);}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 const setup=()=>({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
 function install(next:Pick<PersistentGameSession<RegicideState,RegicideAction>,'getState'|'dispatch'>){session.current=next;setState(next.getState());setPending(null);setSelected([]);setError(false);setRestart(false);setResumed(false);}

 useEffect(()=>{if(pending||restart)confirmRef.current?.focus();},[pending,restart]);
 const start=()=>void run(async()=>{const next=lesson?practiceRegicide(lesson):await startRegicide(createIndexedDbGameStorage(),crypto.randomUUID(),setup());if(mounted.current)install(next);});
 const requestRestart=()=>void run(async()=>{if(!lesson)replacement.current=await getRegicideNewGameChoice(createIndexedDbGameStorage());if(mounted.current)setRestart(true);});
 const replace=()=>void run(async()=>{if(lesson){if(mounted.current)install(practiceRegicide(lesson));return;}if(!replacement.current)return;const next=await confirmRegicideNewGame(createIndexedDbGameStorage(),crypto.randomUUID(),setup(),replacement.current,true);if(next&&mounted.current)install(next);});
 const view=state?inspectRegicide(state):null;
 const legal=state?regicideEngine.getLegalActions(state):[];
 const suits={hearts:{symbol:'♥',name:tr('Cœur','Hearts'),domain:tr('Jade · Guérison','Jade · Healing')},diamonds:{symbol:'♦',name:tr('Carreau','Diamonds'),domain:tr('Vent · Pioche','Wind · Draw')},clubs:{symbol:'♣',name:tr('Trèfle','Clubs'),domain:tr('Lame · Double dégâts','Blade · Double damage')},spades:{symbol:'♠',name:tr('Montagne · Pique','Mountain · Spades'),domain:tr('Montagne · Bouclier','Mountain · Shield')}};
 const describe=(id:string)=>{const [s,r]=id.split('-');const rank=Number(r);const domain=suits[s as keyof typeof suits];return {symbol:domain.symbol,domain:domain.domain,name:domain.name,rank:rank===1?tr('As','Ace'):rank===11?tr('Valet','Jack'):rank===12?tr('Dame','Queen'):rank===13?tr('Roi','King'):String(rank),power:rank>=11?(rank-9)*5:rank};};
 const label=(id:string)=>{const c=describe(id);return c.rank+' '+c.name+' · '+c.power;};
 const card=(id:string)=>{const c=describe(id);return <><strong>{c.symbol} {c.power}</strong><svg viewBox="0 0 100 68" aria-hidden="true"><circle cx="76" cy="17" r="12" fill="#e8b777" opacity=".7"/><path d="M0 60 L28 20 L49 46 L70 27 L100 60 Z" fill="#554061"/><path d="M22 60 H78 M49 15 L49 55 M30 26 L68 26 M39 22 L49 11 L59 22" fill="none" stroke="#e8b777" strokeWidth="2"/><path d="M42 44 L49 30 L56 44 L61 61 H37 Z" fill="#1c1a25" stroke="#d9b67d"/></svg><small>{c.rank} · {c.name}</small><small>{c.domain}</small></>;};
 const choice=legal.find(a=>('cardIds' in a)&&a.cardIds.length===selected.length&&a.cardIds.every(id=>selected.includes(id)));
 const automatic=legal.find(a=>a.type==='resolve-powers'||a.type==='resolve-damage');
 const actionName=(a:RegicideAction)=>a.type==='play'?tr('Attaquer','Attack'):a.type==='retaliate'?tr('Défendre','Defend'):a.type==='resolve-powers'?tr('Résoudre les pouvoirs','Resolve powers'):a.type==='resolve-damage'?tr('Résoudre les dégâts','Resolve damage'):a.type==='use-joker'?tr('Renouveler la main','Renew hand')+' · '+a.jokerId.slice(-1):a.type==='abandon'?tr('Abandonner','Abandon'):tr('Accepter la défaite','Accept defeat');
 const preview=state&&pending?previewRegicide(state,pending):null;
 const phases={play:tr('Attaque','Attack'),powers:tr('Pouvoirs','Powers'),damage:tr('Dégâts','Damage'),retaliation:tr('Riposte','Retaliation'),finished:tr('Terminée','Finished')};
 function confirm(){if(!session.current||!pending)return;void run(async()=>{const r=await session.current!.dispatch(pending);if(!mounted.current)return;if(!r.accepted){setError(true);setPending(null);return;}setState(r.state);setSelected([]);setPending(null);setError(false);setResumed(false);requestAnimationFrame(()=>actionRef.current?.focus());});}
 const cancel=()=>{setPending(null);setRestart(false);requestAnimationFrame(()=>actionRef.current?.focus());};
 return <section className="ldt-board" data-i18n-ignore aria-label={tr('Plateau Les Douze Tyrans','Twelve Tyrants board')} onKeyDown={e=>{if(e.key==='Escape'&&(pending||restart)){e.stopPropagation();e.preventDefault();cancel();}}}>
 <p className="ldt-kicker">LES DOUZE TYRANS · WUXIA / CHANBARA</p>
 <p>{lesson?tr('Entraînement isolé · aucune sauvegarde ni statistique.','Isolated practice · no save or statistics.'):tr('Préversion interne · sauvegarde locale automatique.','Internal preview · automatic local save.')}</p>
 <button className="secondary-action" aria-expanded={showRules} onClick={()=>setShowRules(v=>!v)}>{showRules?tr('Masquer les règles','Hide rules'):tr('Consulter les règles','Read rules')}</button>
 {showRules?<RegicideRulebook language={language}/>:null}
 {resumed?<p className="ldt-resumed" role="status">{tr('Partie reprise · sauvegarde locale','Game resumed · local save')}</p>:null}
 {storageError?<p role="alert">{blocked?tr('Sauvegarde incompatible ou inaccessible. Elle est conservée.','Incompatible or inaccessible save. It is preserved.'):tr('Échec de l’enregistrement. État précédent conservé.','Save failed. Previous state preserved.')}</p>:null}
 {!state||!view?<button className="primary-action" disabled={busy||blocked} onClick={start}>{tr('Commencer une partie','Start a game')}</button>:<>
 <p role="status" aria-live="polite" className="ldt-status">{tr('Tour','Turn')} {state.turn} · {phases[view.phase]} · {tr('Tyrans vaincus','Tyrants defeated')} {12-view.counts.castle-(view.activeEnemy?1:0)}/12</p>
 <div className="ldt-phases">{(['play','powers','damage','retaliation'] as const).map((p,i)=><span key={p} aria-current={view.phase===p?'step':undefined}>{i+1}. {phases[p]}</span>)}</div>
 {view.activeEnemy?<div className="ldt-enemy"><div className="ldt-card ldt-tyrant">{card(view.activeEnemy)}</div><div><h2>{tr('Tyran actif','Active tyrant')}</h2><p>{tr('Immunité','Immunity')}: {describe(view.activeEnemy).name}</p><dl className="ldt-metrics"><div><dt>{tr('Vie','Health')}</dt><dd>{view.enemyHealth}/{view.enemyAttack*2}</dd></div><div><dt>{tr('Riposte','Retaliation')}</dt><dd>{Math.max(0,view.enemyAttack-view.shield)}</dd></div><div><dt>{tr('Bouclier','Shield')}</dt><dd>{view.shield}</dd></div></dl></div></div>:null}
 <div className="ldt-counts"><span>{tr('Château','Castle')}: {view.counts.castle}</span><span>{tr('Taverne','Tavern')}: {view.counts.tavern}</span><span>{tr('Défausse','Discard')}: {view.counts.discard}</span></div>
 <div className="ldt-jokers">{view.jokers.map((j,i)=><button key={j.id} className="secondary-action" disabled={busy||blocked||!!pending||restart||!legal.some(a=>a.type==='use-joker'&&a.jokerId===j.id)} onClick={()=>setPending({type:'use-joker',jokerId:j.id})}>Joker {i+1} · {j.used?tr('Utilisé','Used'):tr('Disponible','Unused')}</button>)}</div>
 <h3>{tr('Votre main','Your hand')} ({view.hand.length}/8)</h3>
 <div className="ldt-hand">{view.hand.map(id=><button type="button" key={id} className="ldt-card" aria-label={label(id)} aria-pressed={selected.includes(id)} disabled={busy||blocked||!!pending||restart||!['play','retaliation'].includes(view.phase)||view.outcome!=='in-progress'} onClick={()=>setSelected(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}>{card(id)}{selected.includes(id)?<span>{tr('Sélectionnée','Selected')}</span>:null}</button>)}</div>
 <h3 ref={actionRef} tabIndex={-1}>{tr('Actions autorisées','Legal actions')}</h3>
 {hintsEnabled?<p>{tr('Sélectionnez les cartes, vérifiez le coup, puis confirmez. Les pouvoirs sont résolus avant les dégâts.','Select cards, preview, then confirm. Powers resolve before damage.')}</p>:null}
 {view.blockedReason?<p role="alert">{tr('Impasse : règle de passage solo à confirmer.','Deadlock: solo pass rule awaiting clarification.')}</p>:null}
 {view.outcome==='in-progress'?<div className="ldt-actions">
 {['play','retaliation'].includes(view.phase)?<button className="primary-action ldt-preview" disabled={busy||blocked||!choice||!!pending||restart} onClick={()=>choice&&setPending(choice)}>{tr('Prévisualiser le coup','Preview move')}</button>:null}
 {automatic?<button className="primary-action ldt-next" disabled={busy||blocked||!!pending||restart} onClick={()=>setPending(automatic)}>{actionName(automatic)}</button>:null}
 {legal.some(a=>a.type==='accept-defeat')?<button className="secondary-action" disabled={busy||blocked||!!pending||restart} onClick={()=>setPending({type:'accept-defeat'})}>{tr('Accepter la défaite','Accept defeat')}</button>:null}
 </div>:<p role="status">{view.outcome==='win'?tr('Victoire','Victory')+' · '+({gold:tr('Or','Gold'),silver:tr('Argent','Silver'),bronze:'Bronze'}[view.result.medal??'gold']):view.outcome==='abandoned'?tr('Partie abandonnée','Game abandoned'):tr('Défaite','Defeat')}</p>}
 {pending?<div className="ldt-confirm" role="group" aria-label={tr('Confirmer le coup','Confirm move')}><p>{actionName(pending)}</p>{'cardIds' in pending?<p>{pending.cardIds.map(label).join(' · ')}</p>:null}
 {preview?.kind==='attack'?<p>{tr('Puissance','Power')}: {preview.power} · {tr('Dégâts','Damage')}: {preview.damage} · {tr('Bouclier ajouté','Shield added')}: {preview.shield} · {tr('Recyclage','Recycle')}: {preview.recycle?tr('Oui','Yes'):tr('Non','No')} · {tr('Pioche','Draw')}: {preview.draw?tr('Oui','Yes'):tr('Non','No')}</p>:preview?.kind==='defence'?<p>{tr('Défense','Defence')}: {preview.power}/{preview.required}</p>:null}
 {pending.type==='use-joker'?<p>{tr('Toute la main sera défaussée.','The entire hand will be discarded.')}</p>:null}
 <button ref={confirmRef} className="primary-action" disabled={busy||blocked} onClick={confirm}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={cancel}>{tr('Annuler','Cancel')}</button></div>:null}
 {error?<p role="alert">{tr('Action refusée. État conservé.','Action rejected. State preserved.')}</p>:null}
 {view.outcome==='in-progress'?<button className="secondary-action" disabled={busy||blocked||!!pending||restart} onClick={()=>setPending({type:'abandon'})}>{tr('Abandonner','Abandon')}</button>:null}
 <button className="secondary-action" disabled={busy||blocked||!!pending||restart} onClick={requestRestart}>{tr('Nouvelle partie','New game')}</button>
 {restart?<div className="ldt-confirm"><p>{tr('Recommencer cette partie ?','Restart this game?')}</p><button ref={confirmRef} className="primary-action" disabled={busy||blocked} onClick={replace}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={cancel}>{tr('Annuler','Cancel')}</button></div>:null}
 </>}
 <p className="help-note">{tr('D’après Regicide de Paul Abrahams, Luke Badger et Andy Richdale.','Based on Regicide by Paul Abrahams, Luke Badger and Andy Richdale.')}</p>
 </section>;
}
