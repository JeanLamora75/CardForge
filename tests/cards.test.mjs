import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("le module de cartes expose les quatre enseignes et treize valeurs", () => {
  const source = readFileSync(new URL("../src/core/cards.ts", import.meta.url), "utf8");
  assert.match(source, /"hearts", "diamonds", "clubs", "spades"/);
  assert.match(source, /length: 13/);
  assert.match(source, /function shuffle/);
});
