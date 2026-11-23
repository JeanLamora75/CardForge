import test from "node:test";
import assert from "node:assert/strict";
import { updateAudioPreferences, playGameplayEffect, suspendAudio } from "../src/application/audio.ts";

test("muted effects never instantiate the audio engine", async () => {
  let created = 0, played = 0;
  const previous = globalThis.AudioContext;
  globalThis.AudioContext = class {
    constructor(){ created++; this.state="running";this.currentTime=0;this.destination={}; }
    resume(){ return Promise.resolve(); }
    suspend(){ return Promise.resolve(); }
    createOscillator(){ return {type:"sine",frequency:{value:0},connect(){},start(){played++;},stop(){}}; }
    createGain(){ return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}; }
  };
  try {
    updateAudioPreferences({music:false,sounds:false});
    playGameplayEffect("place");
    await Promise.resolve();
    assert.equal(created,0);
    assert.equal(played,0);
    updateAudioPreferences({music:false,sounds:true});
    playGameplayEffect("place");
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(created,1);
    assert.equal(played,1);
    updateAudioPreferences({music:false,sounds:false});
    playGameplayEffect("victory");
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(played,1);
  } finally {
    updateAudioPreferences({music:false,sounds:false});
    suspendAudio();
    globalThis.AudioContext=previous;
  }
});
