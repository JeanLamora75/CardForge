import test from "node:test";
import assert from "node:assert/strict";
import {offlineNoticeDelay,resolveOfflineStatus} from "../src/application/offline-readiness.ts";
test("only persistent actionable offline states may produce a notice",()=>{for(const phase of ["installing","ready","unsupported"])assert.equal(offlineNoticeDelay(phase),null);for(const phase of ["reload-required","error"])assert.equal(offlineNoticeDelay(phase),8000);});
test("automatic control resolves the activation warning without reload",()=>{const probe={ready:true,version:"test",assetCount:10};assert.equal(resolveOfflineStatus(probe,false).phase,"reload-required");assert.equal(offlineNoticeDelay(resolveOfflineStatus(probe,true).phase),null);});
