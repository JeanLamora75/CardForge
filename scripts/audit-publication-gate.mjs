import { games } from "../src/catalog.ts";
import { GAME_RELEASE_EVIDENCE, RELEASE_CRITERIA,
  assertCatalogueReleaseSafety, checkGamePublication } from "../src/application/publication-gate.ts";

assertCatalogueReleaseSafety(games);
let blocked=0;
for(const game of games){
  const check=checkGamePublication(GAME_RELEASE_EVIDENCE[game.id]);
  const status=check.allowed ? "READY" : "BLOCKED";
  if(!check.allowed)blocked++;
  console.log("[CAR-43] "+game.title+": "+status+
    (check.missing.length ? " — pending: "+check.missing.join(", ") : ""));
}
const publicationRequested=process.argv.includes("--require-mvp-publication");
const midnightRequested=process.argv.includes("--require-midnight-publication");
if(midnightRequested && !checkGamePublication(GAME_RELEASE_EVIDENCE["loot-the-loop"]).allowed){
  console.error("[CAR-56] PUBLICATION REFUSED: Midnight Syndicate evidence incomplete");
  process.exitCode=1;
}
if(publicationRequested){
  const mvp=["clear-the-dungeon","gridcannon","loot-the-loop","card-capture","regicide"];
  const blockedMvp=mvp.filter(id=>!checkGamePublication(GAME_RELEASE_EVIDENCE[id]).allowed);
  if(blockedMvp.length){
    console.error("[CAR-43] PUBLICATION REFUSED: insufficient reviewed rights/resources for "+
      blockedMvp.join(", "));
    process.exitCode=1;
  } else console.log("[CAR-43] MVP publication evidence complete (deployment still requires separate approval).");
}else if(!midnightRequested) console.log("[CAR-43] Catalogue safe: no unapproved game labelled as available; "+blocked+
  " pending. Internal quality build is NOT permission for public deployment.");
