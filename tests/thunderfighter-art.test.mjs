import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";import {makeDeckWithJokers} from "../src/core/cards.ts";import sharp from "sharp";
test("54 physical cards have distinct decodable local WebP artwork",async()=>{
 const factions={hearts:"nova",diamonds:"vector",clubs:"solaris",spades:"aegis"};
 const source=readFileSync(new URL("../src/application/thunderfighter-art.ts",import.meta.url),"utf8");
 const paths=makeDeckWithJokers().map(c=>"kind" in c?"special/singularity/0"+c.id.slice(-1)+".webp":c.rank===1?"special/"+factions[c.suit]+"/alpha.webp":c.rank>=11?"officers/"+factions[c.suit]+"/"+["lieutenant","commander","admiral"][c.rank-11]+".webp":"ships/"+factions[c.suit]+"/"+String(c.rank).padStart(2,"0")+".webp");
 assert.equal(new Set(paths).size,54);
 assert.match(source,/import\.meta\.env\.BASE_URL/);assert.match(source,/art\/thunderfighter\//);
 for(const p of paths){const buffer=readFileSync(new URL("../public/art/thunderfighter/"+p,import.meta.url));const m=await sharp(buffer).metadata();assert.equal(m.format,"webp",p);assert.ok(m.width>0&&m.height>0,p);await sharp(buffer).resize(16,16).raw().toBuffer();}
});
