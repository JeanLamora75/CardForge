import { useEffect, useRef, useState } from "react";
import type { PlayableLearningGame, LearningChoice, LearningPreferences } from "../application/learning.ts";
import { readLearningPreferences, saveLearningPreferences } from "../application/learning.ts";
import GrimDelveBoard from "./GrimDelveBoard.tsx";
import ThunderfighterBoard from "./ThunderfighterBoard.tsx";
import MidnightSyndicateBoard from "./MidnightSyndicateBoard.tsx";
import MidnightSyndicateRulebook from "./MidnightSyndicateRulebook.tsx";
import SkydeckBoard from "./SkydeckBoard.tsx";
import SkydeckRulebook from "./SkydeckRulebook.tsx";
import type {Locale} from "../i18n/language.ts";

const names: Record<PlayableLearningGame, string> = {
  "clear-the-dungeon": "Grim Delve",
  gridcannon: "Thunderfighter",
  "loot-the-loop": "Midnight Syndicate",
  "card-capture": "Skydeck",
};
function local(): Storage | null {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}
export function Rulebook({ gameId, language="fr" }: { gameId: PlayableLearningGame; language?:Locale }) {
  if (gameId === "card-capture") return <SkydeckRulebook language={language} />;
  if (gameId === "loot-the-loop") return <MidnightSyndicateRulebook />;
  const grim = gameId === "clear-the-dungeon";
  return <article className="learning-rulebook" aria-labelledby="learning-rulebook-title">
    <h2 id="learning-rulebook-title">Règles de {names[gameId]}</h2>
    <p>Jeu source : {grim ? "Clear the Dungeon Classic 1.1.0 · Mark S. Ball" : "Gridcannon Version 2 · Tom Francis"}. L’univers visuel ne modifie aucune règle.</p>
    {grim ? <>
      <section><h3>Objectif et préparation</h3><p>Vaincre les douze figures : les quatre valets (résistance 11), les quatre dames (12) et les quatre rois (13). Mélanger ces douze monstres et les répartir dans quatre colonnes de trois cartes, faces cachées, en révélant le premier monstre de chaque colonne. Mélanger séparément les 40 cartes As à 10 et deux Jokers ; piocher trois cartes de puissance en main.</p></section>
      <section><h3>Déroulement d’une main</h3><p>Utilisez ou défaussez les trois cartes de votre main. Pour préparer une attaque, placez une première carte de puissance, puis une deuxième : leur somme doit atteindre ou dépasser la résistance du monstre. La troisième carte, de l’enseigne du monstre, déclenche l’attaque. Les enseignes des deux cartes de puissance sont libres.</p><p>Une attaque incomplète peut rester posée entre les mains. Les reprises et déplacements éventuels ne concernent que les cartes que le moteur déclare récupérables dans la main actuelle. Quand la main est vide, utilisez « Terminer la main » pour piocher la suivante.</p></section>
      <section><h3>Jokers, défausses et dégâts</h3><p>Dans cette adaptation Classic 1.1.0, un Joker compte pour dix points de puissance et peut représenter l’enseigne nécessaire pour déclencher une attaque. Les cartes inutilisées sont placées dans la pile de dégâts : atteindre sept dégâts fait immédiatement perdre. La réserve optionnelle du jeu original n’est pas utilisée.</p></section>
      <section><h3>Victoire, défaite et score</h3><p>Une attaque complète retire le monstre vaincu et ses trois cartes ; le monstre suivant dans la colonne devient visible. Vaincre les douze monstres est une victoire. Les sept dégâts ou l’épuisement définitif de la pioche entraînent la défaite. Le score d’une victoire correspond au nombre de cartes encore dans la pioche de puissance, sans compter les cartes de la main.</p></section>
    </> : <>
      <section><h3>Objectif et mise en place</h3><p>Vaincre les douze figures Valet, Dame et Roi réparties autour d’une grille 3 × 3. Mélanger les 54 cartes ; remplir neuf piles initiales avec des cartes numériques de 2 à 10 (centre inclus). Mettre de côté les figures pour les placer aux douze secteurs périphériques légaux ; placer les As et Jokers dans la réserve spéciale. Un remplacement facultatif d’une carte initiale peut être proposé après le placement des figures.</p></section>
      <section><h3>Placement des figures et des nombres</h3><p>Une figure rejoint un emplacement périphérique libre adjacent à la carte visible la plus semblable : même enseigne et valeur la plus haute, sinon même couleur et valeur la plus haute, sinon valeur la plus haute. Le moteur propose les emplacements possibles en cas d’égalité ou de contrainte de placement.</p><p>Chaque carte numérique piochée peut être déposée sur une pile dont la valeur supérieure visible est inférieure ou égale à la sienne. Un emplacement vidé par une Extraction est disponible. Les piles conservent leur ordre et leur carte supérieure.</p></section>
      <section><h3>Tirs et résistances</h3><p>Poser une carte à une extrémité d’une rangée ou d’une colonne peut déclencher un tir contre la figure à l’autre extrémité. La nouvelle carte posée ne participe pas à la puissance du tir : seules les deux cartes supérieures intermédiaires comptent. Le Valet (11) accepte toutes les enseignes ; la Dame (12) ne compte que les cartes de sa couleur ; le Roi (13) ne compte que celles de sa propre enseigne. Une figure vaincue reste dans son secteur, face neutralisée. Une pose dans un coin peut déclencher deux tirs simultanés.</p></section>
      <section><h3>Réserve spéciale et armure</h3><p>Un As sert à extraire une pile entière, renvoyée au-dessous de la pioche ; le secteur de grille devient vide. Un Joker permet de réaffecter la carte supérieure d’une pile vers une autre destination légale, avec tir éventuel. Ces six cartes spéciales au maximum sont chacune consommées définitivement après usage.</p><p>Lorsqu’une carte numérique ne peut être posée et qu’aucune séquence spéciale utilisable ne la débloque, elle devient une armure ajoutée à la résistance d’une figure vivante : priorité à l’enseigne identique, puis à la couleur, puis à la plus faible valeur. Une résistance de 20 ou plus sur Valet/Dame, ou de 19 ou plus sur Roi, provoque la défaite.</p></section>
      <section><h3>Recherche et fin de partie</h3><p>Si toutes les figures visibles ont été neutralisées mais qu’il en reste à révéler, rechercher la figure suivante dans la pioche. Les cartes numériques croisées sont temporairement gardées puis réinsérées sous la pioche selon le moteur ; les As/Jokers rejoignent la réserve. La victoire exige les douze figures neutralisées. Une impasse définitive donne une défaite. Le score de victoire est le nombre d’As et de Jokers non dépensés, de zéro à six.</p></section>
    </>}
    {grim?<p className="help-note">Ces règles décrivent le fonctionnement du moteur implémenté. Pour les arbitrages précis, les variantes écartées et les références officielles, consultez le <a href={grim
      ? "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md"
      : "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/gridcannon.md"} target="_blank" rel="noopener noreferrer">référentiel BMAD complet</a>.</p>:null}
  </article>;
}

export default function GameLearning({ gameId, language="fr", hintsEnabled, onHintsChange, initialLearn=false, thunderHelp=false, onCloseThunderHelp }: { gameId: PlayableLearningGame; thunderHelp?:boolean; onCloseThunderHelp?:()=>void; language?:Locale; hintsEnabled: boolean; onHintsChange: (enabled: boolean) => void; initialLearn?:boolean }) {
  const [preferences, setPreferences] = useState<LearningPreferences>(() => readLearningPreferences(local(), gameId));
  const [mode, setMode] = useState<LearningChoice | null>(() => initialLearn?"learn":readLearningPreferences(local(), gameId).choice);
  const [showRules, setShowRules] = useState(false);
  const [tutorialRun, setTutorialRun] = useState(0);
  const [saveWarning, setSaveWarning] = useState(false);
  const name = names[gameId];
  const helpDialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const node=helpDialog.current;if(gameId!=="gridcannon"||!node)return;if(thunderHelp&&!node.open)node.showModal();else if(!thunderHelp&&node.open)node.close();},[thunderHelp,gameId,mode]);
  function closeHelp(){
    helpDialog.current?.close();
    setShowRules(false);
    onCloseThunderHelp?.();
  }
  function choose(choice: LearningChoice) {
    const next = { ...preferences, choice };
    setPreferences(next);
    setMode(choice);
    setSaveWarning(!saveLearningPreferences(local(), gameId, next));
  }
  const controls = <>
<div className="learning-toolbar" role="group" aria-label="Mode de jeu et aide">
        {gameId!=="gridcannon"||mode==="learn"?<span className="learning-mode">{mode === "learn" ? "Tutoriel · entraînement sans sauvegarde" : "Partie normale"}</span>:null}
        <button className="secondary-action" type="button" onClick={() => {choose(mode === "learn" ? "play" : "learn");if(gameId==="gridcannon")onCloseThunderHelp?.();}}>
          {mode === "learn" ? "Jouer librement" : gameId==="gridcannon"?"Tutoriel":"Relancer le tutoriel"}
        </button>
        {mode === "learn" ? <button className="secondary-action" type="button" onClick={() => {setTutorialRun(v => v + 1);if(gameId==="gridcannon")onCloseThunderHelp?.();}}>Recommencer l’entraînement</button> : null}
        <button className="secondary-action" type="button" aria-expanded={showRules} onClick={() => setShowRules(v => !v)}>
          {showRules ? "Masquer les règles" : gameId==="gridcannon"?"Règles":"Consulter les règles"}
        </button>
        <label className="learning-hints"><input type="checkbox" checked={hintsEnabled} onChange={() => onHintsChange(!hintsEnabled)} /> Aide contextuelle</label>
      </div>
      {showRules ? <Rulebook gameId={gameId} language={language} /> : null}
</>;
  return <section className="game-learning" aria-label={`Apprendre ou jouer à ${name}`}>
    {mode === null ? <section className="learning-intro" aria-labelledby="learning-first-title">
      <h2 id="learning-first-title">Bienvenue dans {name}</h2>
      <p>Vous décidez comment commencer. Le tutoriel utilise une partie d’entraînement indépendante ; jouer directement ne nécessite aucune étape préalable.</p>
      <div className="learning-toolbar">
        <button className="primary-action" type="button" onClick={() => choose("learn")}>Apprendre à jouer</button>
        <button className="secondary-action" type="button" onClick={() => choose("play")}>Jouer directement</button>
      </div>
    </section> : <>
      {gameId==="gridcannon"?<dialog ref={helpDialog} className="tf-help-dialog tf-game-help" aria-label={language==="en"?"Help and rules":"Aide et règles"} onClose={()=>{setShowRules(false);onCloseThunderHelp?.();}} onCancel={event=>{event.preventDefault();event.stopPropagation();closeHelp();}} onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();closeHelp();}}}><header className="tf-help-header" data-i18n-ignore><button type="button" className="tf-dialog-close" onClick={closeHelp}>{language==="en"?"Resume game":"Reprendre la partie"}</button></header><div className="tf-help-content">{controls}<p data-i18n-ignore>{language==="en"?"Select a highlighted destination, inspect a card by tapping it, then confirm your move.":"Sélectionnez une destination en surbrillance, touchez une carte pour la consulter, puis confirmez votre coup."}</p></div></dialog>:controls}
      {mode === "learn" ? <p className="learning-safety" role="status">Entraînement isolé : ni sauvegardes ordinaires, ni résultats, ni statistiques ne seront créés ou modifiés. Vous pouvez quitter à tout moment.</p> : null}
      {mode === "learn" ? <div key={tutorialRun}>
        {gameId === "clear-the-dungeon" ? <GrimDelveBoard tutorial hintsEnabled={hintsEnabled} onReplayTutorial={() => setTutorialRun(v => v + 1)} /> :
          gameId === "card-capture" ? <SkydeckBoard tutorial language={language} hintsEnabled={hintsEnabled} /> : gameId === "loot-the-loop" ? <MidnightSyndicateBoard tutorial hintsEnabled={hintsEnabled} onReplayTutorial={() => setTutorialRun(v => v + 1)} /> : <ThunderfighterBoard tutorial language={language} hintsEnabled={hintsEnabled} onReplayTutorial={() => setTutorialRun(v => v + 1)} />}
      </div> : gameId === "clear-the-dungeon" ?
        <GrimDelveBoard hintsEnabled={hintsEnabled} /> : gameId === "loot-the-loop" ?
        <MidnightSyndicateBoard hintsEnabled={hintsEnabled} /> : gameId === "card-capture" ? <SkydeckBoard language={language} hintsEnabled={hintsEnabled} /> : <ThunderfighterBoard language={language} hintsEnabled={false} />}
    </>}
    {saveWarning ? <p role="status" className="help-note">Les préférences ne peuvent pas être mémorisées sur cet appareil ; votre choix fonctionne pour cette visite.</p> : null}
    {mode === null ? <button className="back-link" type="button" aria-expanded={showRules} onClick={() => setShowRules(v => !v)}>{showRules ? "Masquer les règles" : "Lire les règles avant de choisir"}</button> : null}
    {mode === null && showRules ? <Rulebook gameId={gameId} language={language} /> : null}
  </section>;
}
