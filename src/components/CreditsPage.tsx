import { useEffect, useRef } from "react";
import { APP_VERSION, ATTRIBUTIONS, NOTICE_REFERENCES } from "../application/credits.ts";
import type { Locale } from "../i18n/language.ts";

export default function CreditsPage({ language, onBack }: { language: Locale; onBack: () => void }) {
  const en = language === "en";
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);

  return <section className="context-page credits-page" aria-labelledby="credits-heading">
    <button type="button" className="back-link" onClick={onBack}>{en ? "← Back to catalogue" : "← Retour au catalogue"}</button>
    <h1 id="credits-heading" tabIndex={-1} ref={heading}>{en ? "About CardForge and credits" : "À propos de CardForge et crédits"}</h1>
    <p><strong>CardForge — v{APP_VERSION}</strong></p>
    <p>{en
      ? "A free, ad-free collection of solo card games. Each game uses the original game's rules but has an independent visual universe created for CardForge. Naming a source or author does not imply affiliation, endorsement or permission to publish."
      : "Collection gratuite et sans publicité de jeux de cartes solo. Chaque jeu conserve les règles du jeu source et dispose d’un univers visuel distinct conçu pour CardForge. La mention d’une œuvre ou d’un auteur n’implique ni affiliation, ni soutien, ni autorisation de publication."}</p>
    <h2>{en ? "Original games and authors" : "Jeux d’origine et auteurs"}</h2>
    <div className="credits-grid">
      {ATTRIBUTIONS.map(item => <article className="credits-item" key={item.gameId}>
        <h3>{item.publicName}</h3>
        <dl>
          <div><dt>{en ? "Original game" : "Jeu source"}</dt><dd>{item.originalTitle}</dd></div>
          <div><dt>{en ? "Original creator(s)" : "Auteur(s) du jeu source"}</dt><dd>{item.originalAuthors}</dd></div>
          <div><dt>{en ? "CardForge presentation" : "Présentation CardForge"}</dt><dd>{en ? item.visualUniverseEn : item.visualUniverseFr}</dd></div>
        </dl>
        <a href={item.source} target="_blank" rel="noopener noreferrer">{en ? "Original reference" : "Référence du jeu source"} <span aria-hidden="true">↗</span></a>
        <h4>{en ? "Licence notice" : "Notice de licence"}</h4>
        <p>{en ? item.licenceEn : item.licenceFr}</p>
        <h4>{en ? "Publication status" : "Statut des autorisations"}</h4>
        <p className="credits-warning">{en ? item.permissionEn : item.permissionFr}</p>
      </article>)}
    </div>
    <h2>{en ? "Original CardForge work" : "Créations propres à CardForge"}</h2>
    <p>{en
      ? "The application code, game interfaces, visual settings, illustrated-universe concepts and locally generated audio are CardForge project work. The visual universes must not be confused with illustrations or other protected expression from the source games. This statement does not assign a licence to reuse project assets."
      : "Le code de l’application, les interfaces de jeu, les choix de présentation, les concepts d’univers illustrés et l’ambiance sonore générée localement constituent des travaux du projet CardForge. Ces univers ne doivent pas être confondus avec les illustrations ou autres éléments protégés des œuvres sources. Cette mention n’accorde pas de licence de réutilisation des éléments CardForge."}</p>
    <h2>{en ? "Legal notices and useful references" : "Notices et références utiles"}</h2>
    <p>{en
      ? "An explicit Creative Commons licence for a source rulebook is not a blanket permission to distribute an adaptation. Other source licences and permissions have not been independently cleared. No game title is represented here as legally cleared for public release."
      : "Une licence Creative Commons affichée sur un livret source ne vaut pas autorisation générale de diffuser une adaptation. Les licences et permissions des autres sources ne sont pas considérées comme vérifiées. Aucun titre n’est présenté ici comme juridiquement validé pour une diffusion publique."}</p>
    <ul className="credits-references">
      <li><a href={NOTICE_REFERENCES.creativeCommons} target="_blank" rel="noopener noreferrer">Creative Commons BY-NC-ND 4.0</a></li>
      <li><a href={NOTICE_REFERENCES.copyrightStudy} target="_blank" rel="noopener noreferrer">{en ? "Clear the Dungeon rights research" : "Étude des droits Clear the Dungeon"}</a></li>
      <li><a href={NOTICE_REFERENCES.releaseGate} target="_blank" rel="noopener noreferrer">{en ? "Release clearance gate (CAR-43)" : "Vérification juridique avant diffusion (CAR-43)"}</a></li>
      <li><a href={NOTICE_REFERENCES.project} target="_blank" rel="noopener noreferrer">{en ? "CardForge source code and dependencies" : "Code source CardForge et dépendances"}</a></li>
    </ul>
    <p className="help-note">{en
      ? "Third-party software licences are governed by their respective packages; the project dependency manifest can be consulted in the linked repository. This page does not replace a final licence inventory before release."
      : "Les licences des bibliothèques tierces sont propres à chaque dépendance ; leur manifeste est consultable dans le dépôt lié. Cette page ne remplace pas l’inventaire définitif des licences avant diffusion."}</p>
  </section>;
}
