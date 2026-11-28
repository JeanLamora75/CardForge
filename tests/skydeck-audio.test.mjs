import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {skydeckAudioFiles,skydeckActionSounds} from '../src/application/skydeck-audio.ts';
import {normalizeSettings} from '../src/application/shared-settings.ts';
test('all 25 local Skydeck audio assets exist and are unique',()=>{
 const files=Object.values(skydeckAudioFiles);assert.equal(files.length,25);assert.equal(new Set(files).size,25);
 for(const p of files)assert.ok(existsSync('public/assets/audio/skydeck/'+p+'.wav'),p);
});
test('ambience defaults to muted and is independent of music and effects',()=>{
 const s=normalizeSettings({musicVolume:35,soundsVolume:70,ambienceVolume:25});
 assert.equal(s.ambienceVolume,25);assert.equal(s.musicVolume,35);assert.equal(s.soundsVolume,70);assert.equal(normalizeSettings({music:true}).ambienceVolume,0);
});
test('confirmed actions map to distinct sound cues',()=>{
 const view={enemyLine:[],hand:[],counts:{playerDeck:4}};
 assert.deepEqual(skydeckActionSounds({type:'capture-a',jokerCopyId:'hearts-2'},view,view),['cannon','capture','joker']);
 assert.deepEqual(skydeckActionSounds({type:'capture-b'},view,view),['enemyCapture','sacrifice']);
 assert.deepEqual(skydeckActionSounds({type:'capture-c'},view,view),['repel']);
});
