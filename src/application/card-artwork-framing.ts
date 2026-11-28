/** Presentation-only placement within a card's illustration window.
 * Insets reduce the visible artwork without distorting its aspect ratio.
 * The opaque frame covers the edges; the illustration has a matching blurred underlay.
 */
export type CardArtworkFraming = Readonly<{ inset: number; offsetY: number; focusX: number; focusY: number }>;

export function cardArtworkStyle(framing: CardArtworkFraming) {
  return {
    "--card-art-inset": framing.inset + "%",
    "--card-art-offset-y": framing.offsetY + "%",
    "--card-art-focus": framing.focusX + "% " + framing.focusY + "%",
  };
}
