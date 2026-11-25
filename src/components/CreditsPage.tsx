import { useEffect, useRef } from "react";
import { APP_VERSION, ATTRIBUTIONS, NOTICE_REFERENCES } from "../application/credits.ts";
import { WorldLogo } from "./ImmersiveMenu";
import type { Locale } from "../i18n/language.ts";

export default function CreditsPage({ language, onBack }: { language: Locale; onBack: () => void }) {
  const en = language === "en";
  const slugs = {"clear-the-dungeon":"grim-delve",gridcannon:"thunderfighter","card-capture":"skydeck","loot-the-loop":"midnight-syndicate",regicide:"les-douze-tyrans"} as const;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);

  return <section className="context-page credits-page forge-settings-page settings-subpage" data-i18n-ignore aria-labelledby="credits-heading">
    <header className="forge-settings-heading"><button type="button" className="settings-top-back" aria-label={en?"Back to settings":"Retour aux paramètres"} onClick={onBack}>←</button><h1 id="credits-heading" tabIndex={-1} ref={heading}>{en?"Credits and licences":"Crédits et licences"}</h1></header>
    <p><strong>CardForge — v{APP_VERSION}</strong></p>
    <p>{en
      ? "A free, ad-free collection of solo card games. Each game uses the original game's rules but has an independent visual universe created for CardForge. Naming a source or author does not imply affiliation, endorsement or permission to publish."
      : "Collection gratuite et sans publicité de jeux de cartes solo. Chaque jeu conserve les règles du jeu source et dispose d’un univers visuel distinct conçu pour CardForge. La mention d’une œuvre ou d’un auteur n’implique ni affiliation, ni soutien, ni autorisation de publication."}</p>
    <h2>{en ? "Original games and authors" : "Jeux d’origine et auteurs"}</h2>
    <div className="credits-grid">
      {ATTRIBUTIONS.map(item => <details className="credits-item" key={item.gameId}>
        <summary><WorldLogo slug={slugs[item.gameId]} title={item.publicName}/><span>{item.originalTitle}</span></summary>
        {item.gameId === "loot-the-loop" ? <p>{en ? "Based on Loot the Loop, Wil Su (Isaludo)" : "d’après Loot the Loop, Wil Su (Isaludo)"}</p> : null}
        <dl>
          <div><dt>{en ? "Original game" : "Jeu source"}</dt><dd>{item.originalTitle}</dd></div>
          <div><dt>{en ? "Original creator(s)" : "Auteur(s) du jeu source"}</dt><dd>{en ? item.originalAuthors.replace(" et "," and ") : item.originalAuthors}</dd></div>
          <div><dt>{en ? "CardForge presentation" : "Présentation CardForge"}</dt><dd>{en ? item.visualUniverseEn : item.visualUniverseFr}</dd></div>
        </dl>
        <a href={item.source} target="_blank" rel="noopener noreferrer">{en ? "Original reference" : "Référence du jeu source"} <span aria-hidden="true">↗</span></a>
        <h4>{en ? "Licence notice" : "Notice de licence"}</h4>
        <p>{item.gameId==="clear-the-dungeon" ? (en?"Original rule documents: Creative Commons BY-NC-ND 4.0.":"Documents de règles originaux : Creative Commons BY-NC-ND 4.0.") : (en?"Original works remain subject to their respective rights.":"Les œuvres originales restent soumises à leurs droits respectifs.")}</p>

      </details>)}
    </div>
    <details className="credits-section"><summary>{en ? "Original CardForge work" : "Créations propres à CardForge"}</summary>
    <p>{en
      ? "The application code, game interfaces, visual settings, illustrated-universe concepts and locally generated audio are CardForge project work. The visual universes must not be confused with illustrations or other protected expression from the source games. This statement does not assign a licence to reuse project assets."
      : "Le code de l’application, les interfaces de jeu, les choix de présentation, les concepts d’univers illustrés et l’ambiance sonore générée localement constituent des travaux du projet CardForge. Ces univers ne doivent pas être confondus avec les illustrations ou autres éléments protégés des œuvres sources. Cette mention n’accorde pas de licence de réutilisation des éléments CardForge."}</p>
    </details><details className="credits-section"><summary>{en ? "Game menu typography" : "Typographies des menus de jeu"}</summary>
    <p>{en ? "The five embedded typefaces are distributed under the SIL Open Font License 1.1. Full copyright and licence notices are supplied locally." : "Les cinq polices intégrées sont distribuées sous licence SIL Open Font License 1.1. Les mentions de copyright et les licences intégrales sont fournies localement."}</p>
    <ul className="credits-references">
      {([["Rajdhani","rajdhani"],["Cinzel","cinzel"],["Alegreya SC","alegreyasc"],["Josefin Sans","josefinsans"],["Kaushan Script","kaushanscript"]] as const).map(([name,slug]) => <li key={slug}><a href={import.meta.env.BASE_URL+"licenses/fonts/"+slug+".txt"} target="_blank" rel="noopener noreferrer">{name} — SIL OFL 1.1</a></li>)}
    </ul>
    </details><details className="credits-section"><summary>{en ? "Legal notices and useful references" : "Notices et références utiles"}</summary>
    <p>{en
      ? "Credits do not imply endorsement by the original authors or permission to redistribute their works. This preview is not authorized for public distribution."
      : "Les crédits n’impliquent ni soutien des auteurs originaux ni autorisation de redistribuer leurs œuvres. Cette version d’essai n’est pas destinée à une diffusion publique."}</p>
    <ul className="credits-references">
      <li><a href={en ? "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en" : NOTICE_REFERENCES.creativeCommons} target="_blank" rel="noopener noreferrer">Creative Commons BY-NC-ND 4.0</a></li>

    </ul>
    <p className="help-note">{en
      ? "Third-party software remains subject to its own licences."
      : "Les logiciels tiers restent soumis à leurs licences respectives."}</p>
  </details></section>;
}
