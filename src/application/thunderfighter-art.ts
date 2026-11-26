// Public assets are versioned and precached by the Vite offline build.
const root=import.meta.env.BASE_URL+"art/thunderfighter/";
const factions={hearts:"nova",diamonds:"vector",spades:"aegis",clubs:"solaris"} as const;
const officers=["lieutenant","commander","admiral"];
export const thunderArt:Readonly<Record<string,string>>=Object.fromEntries([
 ...Object.entries(factions).flatMap(([suit,faction])=>Array.from({length:13},(_,i)=>{
  const rank=i+1;
  const path=rank===1?`special/${faction}/alpha.webp`:rank>=11?`officers/${faction}/${officers[rank-11]}.webp`:`ships/${faction}/${String(rank).padStart(2,"0")}.webp`;
  return [`${suit}-${rank}`,root+path];
 })),
 ...[1,2].map(n=>[`joker-${n}`,root+`special/singularity/0${n}.webp`])
]);
