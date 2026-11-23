import { PRIVACY_INVENTORY, DELETION_POLICY } from "../application/privacy.ts";
import type { Locale } from "../i18n/language.ts";

export default function PrivacyPanel({ language }: { language: Locale }) {
  const english = language === "en";
  return <section className="privacy-panel" aria-labelledby="privacy-title">
    <h2 id="privacy-title">{english ? "Privacy and my data" : "Confidentialité et mes données"}</h2>
    <p>{english
      ? "CardForge runs without an account, advertising or game-data synchronization. Saved games, results, statistics and preferences are stored in this browser, on this device. Closing or navigating away does not delete them."
      : "CardForge fonctionne sans compte, sans publicité et sans synchronisation des données de jeu. Les parties, résultats, statistiques et préférences sont stockés dans ce navigateur, sur cet appareil. Quitter l’application ou changer d’écran ne les efface pas."}</p>
    <p>{english
      ? "The source-rule links open GitHub only if you choose them. Your browser or operating system may manage storage, backups or deletion independently of CardForge."
      : "Les liens vers les règles sources ouvrent GitHub uniquement si vous les choisissez. Votre navigateur ou système d’exploitation peut gérer son stockage, ses sauvegardes ou son effacement indépendamment de CardForge."}</p>
    <h3>{english ? "What is stored?" : "Quelles données sont conservées ?"}</h3>
    <ul className="privacy-inventory">{PRIVACY_INVENTORY.map(item =>
      <li key={item.id}>
        <strong>{english ? item.descriptionEn : item.descriptionFr}</strong>
        <span>{english ? item.effectEn : item.effectFr}</span>
        <small>{item.area === "indexeddb" ? "IndexedDB" : item.area === "localStorage" ? "localStorage" : english ? "Temporary memory" : "Mémoire temporaire"}</small>
      </li>
    )}</ul>
    <h3>{english ? "Delete my data" : "Supprimer mes données"}</h3>
    <p>{english
      ? "No deletion is performed automatically. The available deletion scopes must first be approved by the Product Owner so that clearing one category never silently removes other data."
      : "Aucun effacement n’est effectué automatiquement. Les périmètres de suppression doivent d’abord être validés par le Product Owner, afin qu’effacer une catégorie ne supprime jamais silencieusement les autres données."}</p>
    <p className="help-note" role="status" data-policy={DELETION_POLICY}>
      {english ? "Deletion controls are not yet available. Your data remains unchanged." : "Les commandes de suppression ne sont pas encore disponibles. Vos données restent inchangées."}
    </p>
  </section>;
}
