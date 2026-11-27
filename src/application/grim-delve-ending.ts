import type {GrimDelveState} from "../games/clear-the-dungeon/engine.ts";
import type {Locale} from "../i18n/language.ts";
export function grimEnding(state:Pick<GrimDelveState,"outcome"|"endReason"|"defeated"|"damages"|"victoryScore">,language:Locale){
 const fr=language==="fr", win=state.outcome==="win", damage=state.endReason==="damage"||(state.endReason==null&&state.damages.length===7);
 const scene=win?"victory":damage?"defeat-damage":"defeat-exhaustion";
 const count=state.defeated.length;
 const narrative=win?(fr?"Le donjon est purifié !":"The dungeon is cleansed!"):count===11?(fr?"À un monstre de la victoire !":"One monster away from victory!"):count>=8?(fr?"La victoire était à votre portée.":"Victory was within reach."):count>=4?(fr?"Votre courage a ébranlé le donjon.":"Your courage shook the dungeon."):(fr?"Les ténèbres dominent encore.":"Darkness still prevails.");
 return {scene,narrative,title:win?(fr?"Victoire · Le donjon est purifié":"Victory · The dungeon is cleansed"):damage?(fr?"Défaite · L’expédition s’achève":"Defeat · The expedition ends"):(fr?"Défaite · Ressources épuisées":"Defeat · Resources exhausted"),explanation:win?(fr?"Les ténèbres reculent devant votre triomphe.":"Darkness retreats before your triumph."):damage?(fr?"Sept dégâts subis ont mis fin à la partie.":"Seven damage ended the expedition."):(fr?"La pioche et la main sont épuisées.":"The deck and hand are exhausted."),score:win?state.victoryScore??null:null};
}
