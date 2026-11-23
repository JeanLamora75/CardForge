import test from "node:test";
import assert from "node:assert/strict";
import {
  LANGUAGE_KEY, SUPPORTED_LOCALES, resolveLanguage, readLanguage, saveLanguage, english,
} from "../src/i18n/language.ts";
import { translateUiText } from "../src/i18n/surface.ts";
import { rulebookEnglish } from "../src/i18n/rulebook.ts";
import { grimDelveEngine } from "../src/games/clear-the-dungeon/engine.ts";
import { thunderfighterEngine } from "../src/games/gridcannon/engine.ts";

function fakeStorage() {
  const values=new Map();
  return { values, getItem: key=>values.get(key)??null, setItem: (key,value)=>values.set(key,value) };
}
test("FR/EN only, region variants, English fallback and browser language priority",()=>{
  assert.deepEqual(SUPPORTED_LOCALES,["fr","en"]);
  assert.equal(resolveLanguage("fr-FR"),"fr");
  assert.equal(resolveLanguage("en-US"),"en");
  assert.equal(resolveLanguage("es-ES"),"en");
  assert.equal(resolveLanguage(["es-ES","fr-CA"]),"fr");
  assert.equal(resolveLanguage(["de","it"]),"en");
  assert.equal(resolveLanguage([]),"en");
});
test("Manual language choice persists and always takes precedence over browser preference",()=>{
  const storage=fakeStorage();
  assert.equal(readLanguage(storage,["fr-FR"]),"fr");
  assert.equal(saveLanguage(storage,"en"),true);
  assert.equal(storage.values.get(LANGUAGE_KEY),"en");
  assert.equal(readLanguage(storage,["fr-FR"]),"en");
  assert.equal(saveLanguage(storage,"fr"),true);
  assert.equal(readLanguage(storage,["en-GB"]),"fr");
});
test("Storage failures never block language resolution or manual selection",()=>{
  const denied={getItem(){throw Error("denied");},setItem(){throw Error("denied");}};
  assert.equal(readLanguage(denied,["fr-FR"]),"fr");
  assert.equal(saveLanguage(denied,"en"),false);
  assert.equal(readLanguage(null,["zz"]),"en");
  const bad=fakeStorage();
  bad.values.set(LANGUAGE_KEY,"de");
  assert.equal(readLanguage(bad,["en-GB"]),"en");
});
test("Catalogue and public game names remain stable, while presentation changes only in English",()=>{
  for (const name of ["Grim Delve","Thunderfighter","Skydeck","Midnight Syndicate","Les Douze Tyrans"]) {
    assert.equal(translateUiText(name,"en"),name);
    assert.equal(translateUiText(name,"fr"),name);
  }
  assert.equal(translateUiText("Victoire · Le donjon est libéré","en"),"Victory · The dungeon is free");
  assert.equal(translateUiText("Victoire · Le donjon est libéré","fr"),"Victoire · Le donjon est libéré");
  assert.equal(translateUiText("Monstres vaincus : 3 / 12","en"),"Monsters defeated: 3 / 12");
  assert.equal(translateUiText("Retour à Thunderfighter","en"),"Back to Thunderfighter");
});
test("Both complete rulebooks are bundled locally, translating paragraphs without external lookup",()=>{
  assert.equal(Object.keys(rulebookEnglish).length,12);
  for (const [fr,en] of Object.entries(rulebookEnglish)) {
    assert.ok(fr.length>80);
    assert.ok(en.length>80);
    assert.equal(translateUiText(fr,"en"),en);
    assert.equal(translateUiText(fr,"fr"),fr);
  }
  assert.ok(Object.keys(english).length>100);
});
test("Dynamic card labels and destructive action confirmations localize without exposing card IDs", () => {
  assert.equal(translateUiText("Valet de Cœur","en"),"Jack of Hearts");
  assert.equal(translateUiText("As de Pique","en"),"Ace of Spades");
  assert.equal(translateUiText("10 de Carreau","en"),"10 of Diamonds");
  assert.equal(translateUiText("clubs-11","en"),"clubs-11");
  assert.equal(translateUiText("Défausser cette carte ? Cela ajoute un dégât irréversible.","en"),
    "Discard this card? It adds one irreversible damage point.");
  assert.equal(translateUiText("Défausser toutes les cartes restantes ? Les dégâts sont irréversibles.","en"),
    "Discard all remaining cards? Damage is irreversible.");
});
test("Translating presentation data never changes a seeded engine state",()=>{
  for (const [engine,seed] of [[grimDelveEngine,123],[thunderfighterEngine,321]]) {
    const state=engine.createInitialState({seed});
    const initial=structuredClone(state);
    translateUiText("Partie normale","en");
    translateUiText("Règles de Thunderfighter","en");
    translateUiText("Cartes en main","en");
    assert.deepEqual(state,initial);
    assert.deepEqual(engine.validateState(state),{valid:true});
  }
});
