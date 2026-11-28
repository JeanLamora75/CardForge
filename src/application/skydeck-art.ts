export const skydeckFactions = {
  hearts: { key: 'pirates', fr: 'Pirates du ciel', en: 'Sky pirates', symbol: '☠' },
  diamonds: { key: 'marine', fr: 'Marine', en: 'Navy', symbol: '⚓' },
  clubs: { key: 'merchant-guild', fr: 'Guilde marchande', en: 'Merchant guild', symbol: '⚖' },
  spades: { key: 'sky-knights', fr: 'Chevaliers du ciel', en: 'Sky knights', symbol: '✦' },
} as const;
const officers = ['lieutenant', 'commander', 'admiral'];
export function skydeckCardArt(id: string) {
  if (id === 'joker-1' || id === 'joker-2') return { image: 'art/cards/skydeck/'+id+'.webp', frame: 'art/frames/skydeck/card-joker.webp' };
  const [suit, raw] = id.split('-');
  const faction = skydeckFactions[suit as keyof typeof skydeckFactions];
  const rank = Number(raw);
  if (!faction || !Number.isInteger(rank) || rank < 1 || rank > 13 || id !== suit+'-'+rank) return undefined;
  const file = rank >= 11 ? 'officers/'+faction.key+'/'+officers[rank-11] : 'ships/'+faction.key+'/'+String(rank).padStart(2,'0');
  return { image: 'art/cards/skydeck/'+file+'.webp', frame: 'art/frames/skydeck/card-'+faction.key+'.webp' };
}
