import type { CardArtworkFraming } from './card-artwork-framing.ts';

const shipFraming: CardArtworkFraming = Object.freeze({inset:3,offsetY:0,focusX:50,focusY:50});
const officerFraming: CardArtworkFraming = Object.freeze({inset:2,offsetY:7,focusX:50,focusY:25});
const corsairFraming: CardArtworkFraming = Object.freeze({inset:3,offsetY:8,focusX:50,focusY:25});
const individualFraming: Readonly<Record<string,CardArtworkFraming>> = Object.freeze({
  'diamonds-13': {inset:3,offsetY:9,focusX:50,focusY:20},
  'spades-11': {inset:3,offsetY:9,focusX:50,focusY:20},
  'hearts-5': {inset:5,offsetY:0,focusX:50,focusY:50},
  'hearts-6': {inset:5,offsetY:0,focusX:50,focusY:50},
  'hearts-8': {inset:5,offsetY:0,focusX:50,focusY:50},
  'joker-1': corsairFraming,
  'joker-2': corsairFraming,
});

export const skydeckFactions = {
  hearts: { key: 'pirates', fr: 'Pirates du ciel', en: 'Sky pirates', symbol: '☠' },
  diamonds: { key: 'marine', fr: 'Marine', en: 'Navy', symbol: '⚓' },
  clubs: { key: 'merchant-guild', fr: 'Guilde marchande', en: 'Merchant guild', symbol: '⚖' },
  spades: { key: 'sky-knights', fr: 'Chevaliers du ciel', en: 'Sky knights', symbol: '✦' },
} as const;
const officers = ['lieutenant', 'commander', 'admiral'];
export function skydeckCardArt(id: string) {
  if (id === 'joker-1' || id === 'joker-2') return { image: 'art/cards/skydeck/'+id+'.webp', frame: 'art/frames/skydeck/card-joker.webp', framing: individualFraming[id] };
  const [suit, raw] = id.split('-');
  const faction = skydeckFactions[suit as keyof typeof skydeckFactions];
  const rank = Number(raw);
  if (!faction || !Number.isInteger(rank) || rank < 1 || rank > 13 || id !== suit+'-'+rank) return undefined;
  const file = rank >= 11 ? 'officers/'+faction.key+'/'+officers[rank-11] : 'ships/'+faction.key+'/'+String(rank).padStart(2,'0');
  return { image: 'art/cards/skydeck/'+file+'.webp', frame: 'art/frames/skydeck/card-'+faction.key+'.webp', framing: individualFraming[id] ?? (rank >= 11 ? officerFraming : shipFraming) };
}
