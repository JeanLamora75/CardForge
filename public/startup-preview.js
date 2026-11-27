const labels={fr:{start:"Initialisation de CardForge…",deps:"Préparation des dépendances…",art:"Préparation des univers…",build:"Compilation de CardForge…",verify:"Vérification hors ligne…",cache:"Derniers préparatifs…",ready:"Prêt à jouer !",error:"Le démarrage a échoué. Consultez la console puis relancez CardForge."},en:{start:"Starting CardForge…",deps:"Preparing dependencies…",art:"Preparing worlds…",build:"Building CardForge…",verify:"Checking offline support…",cache:"Final preparations…",ready:"Ready to play!",error:"Startup failed. Check the console and restart CardForge."}};
const locale=(navigator.languages||[]).map(x=>x.split("-")[0]).find(x=>x==="fr"||x==="en")||"en";
document.documentElement.lang=locale;
const number=document.getElementById("cf-progress-number"),bar=document.getElementById("cf-progress"),stage=document.getElementById("cf-stage"),error=document.getElementById("cf-error");
stage.textContent=labels[locale].start;
async function update(){try{const r=await fetch("/status",{cache:"no-store"});if(!r.ok)throw Error("status");const s=await r.json();bar.value=s.progress;number.textContent=s.progress+" %";stage.textContent=labels[locale][s.stage]||labels[locale].start;if(s.error){error.hidden=false;error.textContent=labels[locale].error;return;}}catch{/* Keep the splash visible during transient connection errors. */}setTimeout(update,250);}
void update();
