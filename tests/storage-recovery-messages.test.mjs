import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveMigrationError } from '../src/application/save-migrations.ts';
import { GameRestoreError } from '../src/application/persistent-game-session.ts';
import { LocalStorageError } from '../src/ports/local-storage.ts';
import { classifyRecoveryProblem, storageRecoveryMessage } from '../src/application/storage-recovery-messages.ts';
import { registeredGameMigrations, REGISTERED_SAVE_MIGRATIONS, resumeRegisteredGame } from '../src/application/registered-save-migrations.ts';
import { grimDelveEngine, GRIM_DELVE_RULES_VERSION } from '../src/games/clear-the-dungeon/engine.ts';
import { thunderfighterEngine, THUNDERFIGHTER_RULES_VERSION } from '../src/games/gridcannon/engine.ts';
import { midnightSyndicateEngine, MIDNIGHT_SYNDICATE_RULES_VERSION } from '../src/games/loot-the-loop/engine.ts';

test('CAR-41: quota root-cause survives nested migration and storage exceptions',()=>{
 const quota=new DOMException('Storage capacity reached','QuotaExceededError');
 const wrapper=new LocalStorageError('write-failed','Aborted transaction',{cause:quota});
 const migration=new SaveMigrationError('storage-failed','Could not commit',{cause:wrapper});
 assert.equal(classifyRecoveryProblem(migration),'quota');
 assert.match(storageRecoveryMessage(migration,'write'),/stockage local est plein/i);
 assert.match(storageRecoveryMessage(migration,'write',true),/storage is full/i);
 assert.match(storageRecoveryMessage(migration,'write'),/Ne supprimez pas/i);
});
test('CAR-41: incompatible, corrupt, migration failure, unavailable and generic failures have truthful different messages',()=>{
 const incompatible=new SaveMigrationError('incompatible','Missing migration');
 const corrupt=new SaveMigrationError('corrupt','Invalid');
 const failed=new SaveMigrationError('migration-failed','Invalid state');
 const denied=new LocalStorageError('unavailable','Denied');
 assert.equal(classifyRecoveryProblem(incompatible),'incompatible');
 assert.equal(classifyRecoveryProblem(corrupt),'corrupt');
 assert.equal(classifyRecoveryProblem(failed),'migration');
 assert.equal(classifyRecoveryProblem(denied),'unavailable');
 assert.equal(classifyRecoveryProblem(new GameRestoreError('Unknown version')),'incompatible');
 for(const [error,fragment] of [
  [incompatible,/n’a pas été remplacée/],
  [corrupt,/Conservez les données/],
  [failed,/Conservez les données/],
  [denied,/indisponible/],
  [new Error('fail'),/coup n’a pas été confirmé/],
 ]) assert.match(storageRecoveryMessage(error,'write'),fragment);
 assert.match(storageRecoveryMessage(new Error('read error'),'read'),/partie enregistrée est illisible/);
});
import { skydeckEngine, SKYDECK_RULES_VERSION } from '../src/games/card-capture/engine.ts';

import {regicideEngine,REGICIDE_RULES_VERSION} from '../src/games/regicide/engine.ts';

test('CAR-41: explicit migration registry allows all five unchanged format v1 games and never synthesizes a conversion',async()=>{
 assert.deepEqual(registeredGameMigrations('clear-the-dungeon'),[]);
 assert.deepEqual(registeredGameMigrations('gridcannon'),[]);
 assert.deepEqual(registeredGameMigrations('loot-the-loop'),[]);
 assert.deepEqual(registeredGameMigrations('card-capture'),[]);
 assert.deepEqual(registeredGameMigrations('regicide'),[]);
 assert.deepEqual(Object.keys(REGISTERED_SAVE_MIGRATIONS).sort(),['card-capture','clear-the-dungeon','gridcannon','loot-the-loop','regicide']);
 assert.throws(()=>registeredGameMigrations('unknown'),error=>error.code==='incompatible');
 for(const [engine,gameId,rulesVersion] of [
  [grimDelveEngine,'clear-the-dungeon',GRIM_DELVE_RULES_VERSION],
  [thunderfighterEngine,'gridcannon',THUNDERFIGHTER_RULES_VERSION],
  [midnightSyndicateEngine,'loot-the-loop',MIDNIGHT_SYNDICATE_RULES_VERSION],
  [skydeckEngine,'card-capture',SKYDECK_RULES_VERSION],
  [regicideEngine,'regicide',REGICIDE_RULES_VERSION],
 ]){
  const current=engine.createInitialState({seed:99});
  const stored={gameId,sessionId:'registered-test',rulesVersion,formatVersion:1,state:current};
  const storage={readGame:async()=>structuredClone(stored)};
  const session=await resumeRegisteredGame(engine,storage,{gameId,rulesVersion,formatVersion:1});
  assert.deepEqual(session.getState(),current);
  await assert.rejects(()=>resumeRegisteredGame(engine,storage,{gameId,rulesVersion,formatVersion:2}),
   error=>error.code==='incompatible');
  assert.deepEqual(stored.state,current);
 }
});
