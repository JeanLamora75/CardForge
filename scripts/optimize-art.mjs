import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {createHash} from "node:crypto";
import sharp from "sharp";
const manifest=JSON.parse(readFileSync("_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json","utf8"));
for(const item of manifest){
 const source=readFileSync(item.path);
 if(createHash("sha256").update(source).digest("hex")!==item.sha256)throw Error("Original checksum mismatch: "+item.path);
 if(!item.path.startsWith("public/assets/"))continue;
 const target=resolve("public/art",item.path.slice("public/assets/".length).replace(/\.png$/,".webp"));
 mkdirSync(dirname(target),{recursive:true});
 const size=item.path.includes("/worlds")?1600:item.path.includes("/covers/")?760:1000;
 const buffer=await sharp(source).resize({width:size,height:size,fit:"inside",withoutEnlargement:true}).webp({quality:82,alphaQuality:90}).toBuffer();
 writeFileSync(target,buffer);
 console.log(item.path+" -> "+buffer.length+" bytes");
}
