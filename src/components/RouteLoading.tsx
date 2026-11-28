import type { Locale } from "../i18n/language.ts";

export default function RouteLoading({language}: {language: Locale}) {
  return <p data-i18n-ignore role="status" className="forge-route-loading" style={{margin:"16px auto",padding:"12px",maxWidth:"90%",textAlign:"center",background:"#211b1b",color:"#ffe9b4",border:"1px solid #b99a65",borderRadius:8}}>
    {language==="fr"?"Chargement du jeu…":"Loading game…"}
  </p>;
}
