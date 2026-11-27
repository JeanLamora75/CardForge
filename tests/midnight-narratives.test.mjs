import test from 'node:test';
import assert from 'node:assert/strict';
import {midnightCardArt} from '../src/application/midnight-card-art.ts';
import {midnightNarratives,visibleMidnightNarrative} from '../src/application/midnight-narratives.ts';
test('53 unique bilingual narrative entries and hidden projection',()=>{assert.deepEqual(Object.keys(midnightNarratives).sort(),Object.keys(midnightCardArt).sort());assert.equal(Object.keys(midnightNarratives).length,53);for(const language of ['fr','en']){assert.equal(new Set(Object.values(midnightNarratives).map(n=>n[language])).size,53);for(const id of Object.keys(midnightCardArt))assert.ok(visibleMidnightNarrative({position:0,faceUp:true,id},language));assert.equal(visibleMidnightNarrative({position:0,faceUp:false},language),undefined);}});
