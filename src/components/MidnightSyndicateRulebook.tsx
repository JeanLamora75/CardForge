export default function MidnightSyndicateRulebook() {
  return <article className="learning-rulebook" aria-labelledby="learning-rulebook-title">
    <h2 id="learning-rulebook-title">Règles de Midnight Syndicate</h2>
    <p>Jeu source : Loot the Loop · Wil Su · Isaludo Beta 1.11. L’univers visuel ne modifie aucune règle.</p>
    <section><h3>Objectif et préparation</h3><p>Mélangez 53 cartes : 52 cartes classiques et un seul Joker. Toutes commencent face cachée. Le sommet représente votre position dans un parcours circulaire. Récupérez les quatre As, puis atteignez le Joker visible en explorant.</p></section>
    <section><h3>Observer et explorer</h3><p>Une action par tour. Observer est autorisé si la première carte est cachée : rendez visibles les deux premières sans changer leur ordre. Pour explorer, choisissez la valeur d’une carte visible de 2 à 10 parmi les deux premières. Déplacez exactement ce nombre de cartes du sommet vers le bas, dans le même ordre.</p></section>
    <section><h3>Résoudre la destination</h3><p>Une arrivée sur une carte cachée ne produit aucun effet. Un As ou une carte numérique visible rejoint le butin et quitte le parcours. Une arrivée sur un Valet, une Dame ou un Roi visible provoque une défaite. Un Joker visible ne permet de gagner que si les quatre As sont déjà au butin.</p></section>
    <section><h3>Notes de parcours</h3><p>Marquez la première carte si elle est visible, numérique de 2 à 10 et si une des trois places de notes est libre. Elle quitte le parcours sans rejoindre le butin. Restituer une note la remet visible au sommet. Ces actions sont distinctes et ne permettent aucun déplacement gratuit.</p></section>
    <section><h3>Inspection, victoire et score</h3><p>Inspectez librement les positions et les cartes déjà visibles, sans révéler les cartes cachées ni consommer un tour. Une impasse démontrée entraîne une défaite ; une possibilité de détour par les notes doit être prise en compte. Observer le Joker ou récupérer le quatrième As ne suffit pas pour gagner. Le score officiel de victoire est le nombre de cartes au butin, pas la somme de leurs valeurs.</p></section>
    <p className="help-note">Ces règles sont disponibles hors ligne. Le tutoriel ne modifie ni les sauvegardes ni les statistiques.</p>
  </article>;
}
