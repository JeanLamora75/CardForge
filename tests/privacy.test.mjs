import test from "node:test";
import assert from "node:assert/strict";
import { PRIVACY_INVENTORY, DELETION_POLICY, canDeletePrivacyData } from "../src/application/privacy.ts";

test("privacy inventory covers every persisted data family and temporary tutorials", () => {
  const actual=PRIVACY_INVENTORY.map(item=>item.id);
  assert.deepEqual(actual,["sessions","results","statistics","language","settings","learning","tutorial"]);
  assert.equal(new Set(actual).size,actual.length);
  for(const entry of PRIVACY_INVENTORY){
    assert.ok(entry.descriptionFr.length>10);
    assert.ok(entry.descriptionEn.length>10);
    assert.ok(entry.effectFr.length>10);
    assert.ok(entry.effectEn.length>10);
  }
  assert.equal(PRIVACY_INVENTORY.find(item=>item.id==="tutorial")?.area,"memory");
  assert.ok(PRIVACY_INVENTORY.filter(item=>item.area==="indexeddb").length===3);
  assert.ok(PRIVACY_INVENTORY.filter(item=>item.area==="localStorage").length===3);
});
test("unapproved erasure scope cannot trigger a write, deletion or reset", () => {
  assert.equal(DELETION_POLICY,"pending-product-owner-approval");
  assert.equal(canDeletePrivacyData(),false);
  const source=JSON.stringify(PRIVACY_INVENTORY);
  assert.equal(canDeletePrivacyData(),false);
  assert.equal(JSON.stringify(PRIVACY_INVENTORY),source);
});
