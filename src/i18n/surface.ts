import { english, type Locale } from "./language.ts";
import { rulebookEnglish } from "./rulebook.ts";

const translations = Object.entries({ ...english, ...rulebookEnglish })
  .filter(([source, translated]) => source !== translated)
  .sort((a, b) => b[0].length - a[0].length);
const exact = new Map(translations);
const originals = new WeakMap<Text, { source: string; output: string }>();
const attributes = new WeakMap<Element, Map<string, { source: string; output: string }>>();

function escaped(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** Only changes display text, never game state, action payload or card identity. */
export function translateUiText(text: string, locale: Locale): string {
  if (locale === "fr" || !text.trim()) return text;
  const before = text.trim();
  const direct = exact.get(before);
  if (direct !== undefined) return text.replace(before, direct);
  let result = text;
  for (const [source, translated] of translations) {
    if (source.length < 4 || !result.includes(source)) continue;
    // Match full phrases or words, not substrings of card IDs or English tokens.
    const expression = new RegExp(`(?<![\\p{L}\\p{N}])${escaped(source)}(?![\\p{L}\\p{N}])`, "gu");
    result = result.replace(expression, translated);
  }
  return result;
}

function ignored(node: Node): boolean {
  const parent = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return !!parent?.closest("script, style, textarea, input, select, code, pre, [data-i18n-ignore]");
}
function localizeText(node: Text, locale: Locale): void {
  if (ignored(node)) return;
  const now = node.nodeValue ?? "";
  const record = originals.get(node);
  const source = record && record.output === now ? record.source : now;
  const output = translateUiText(source, locale);
  originals.set(node, { source, output });
  if (now !== output) node.nodeValue = output;
}
function localizeAttributes(element: Element, locale: Locale): void {
  if (ignored(element)) return;
  let recorded = attributes.get(element);
  if (!recorded) { recorded = new Map(); attributes.set(element, recorded); }
  for (const name of ["aria-label", "title", "placeholder", "alt"]) {
    const current = element.getAttribute(name);
    if (current === null) continue;
    const previous = recorded.get(name);
    const source = previous && previous.output === current ? previous.source : current;
    const output = translateUiText(source, locale);
    recorded.set(name, { source, output });
    if (current !== output) element.setAttribute(name, output);
  }
}
function translateTree(root: Node, locale: Locale): void {
  if (root.nodeType === Node.TEXT_NODE) { localizeText(root as Text, locale); return; }
  if (root.nodeType !== Node.ELEMENT_NODE || ignored(root)) return;
  const element = root as Element;
  localizeAttributes(element, locale);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const child = walker.currentNode;
    if (child.nodeType === Node.TEXT_NODE) localizeText(child as Text, locale);
    else localizeAttributes(child as Element, locale);
  }
}
/**
 * React owns structure and state. This view-only adapter translates rendered
 * strings after reconciliation; mutations never call engine transitions.
 */
export function localizeSurface(root: Element, locale: Locale): () => void {
  translateTree(root, locale);
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") translateTree(mutation.target, locale);
      else if (mutation.type === "attributes") translateTree(mutation.target, locale);
      else for (const node of mutation.addedNodes) translateTree(node, locale);
    }
  });
  observer.observe(root, {
    subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ["aria-label", "title", "placeholder", "alt"],
  });
  return () => observer.disconnect();
}
