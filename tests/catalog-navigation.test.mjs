import test from 'node:test';
import assert from 'node:assert/strict';
import { games } from '../src/catalog.ts';
import { readCatalogGameProgress, availableGameActions, victoryRate } from '../src/application/catalog-navigation.ts';
import { stableResultId } from '../src/ports/local-storage.ts';

function storageFixture({ game, result, statistics, reject = false } = {}) {
  const reads = [];
  const writes = [];
  return {
    reads, writes,
    storage: {
      async readGame(id) { reads.push(['game', id]); if (reject) throw Error('unavailable'); return game; },
      async readResult(id) { reads.push(['result', id]); return result; },
      async readStatistics(id) { reads.push(['statistics', id]); return statistics; },
      async commit(value) { writes.push(value); },
      async commitTerminal(value) { writes.push(value); },
      async replaceGame(value) { writes.push(value); },
    },
  };
}

test('CAR-30: opening a game with no save reads only game and statistics, never writes', async () => {
  const { storage, reads, writes } = storageFixture();
  assert.deepEqual(await readCatalogGameProgress(storage, 'gridcannon'), {
    indicator:'none', statistics:null,
  });
  assert.deepEqual(reads,[['game','gridcannon'],['statistics','gridcannon']]);
  assert.deepEqual(writes,[]);
});
test('CAR-30: active save is shown without starting, abandoning or resuming it', async () => {
  const game={gameId:'clear-the-dungeon',sessionId:'active-42',state:{step:9}};
  const { storage,reads,writes }=storageFixture({game});
  assert.deepEqual(await readCatalogGameProgress(storage,'clear-the-dungeon'),{
    indicator:'active',statistics:null,
  });
  assert.ok(reads.some(x=>x[0]==='result'&&x[1]===stableResultId('clear-the-dungeon','active-42')));
  assert.deepEqual(writes,[]);
  assert.deepEqual(game.state,{step:9});
});
test('CAR-30: a saved terminal result does not count as a resumable active game', async () => {
  const game={gameId:'gridcannon',sessionId:'finished'};
  const result={id:stableResultId('gridcannon','finished'),gameId:'gridcannon',sessionId:'finished',outcome:'win'};
  const stats={gameId:'gridcannon',played:1,won:1,lost:0,abandoned:0};
  const {storage,writes}=storageFixture({game,result,statistics:stats});
  assert.deepEqual(await readCatalogGameProgress(storage,'gridcannon'),{
    indicator:'finished',statistics:stats,
  });
  assert.deepEqual(writes,[]);
});
test('CAR-30: incompatible save metadata fails closed without altering source save', async () => {
  const game={gameId:'regicide',sessionId:'bad'};
  const {storage,writes}=storageFixture({game});
  await assert.rejects(()=>readCatalogGameProgress(storage,'gridcannon'),/Inconsistent/);
  assert.deepEqual(writes,[]);
  assert.deepEqual(game,{gameId:'regicide',sessionId:'bad'});
});
test('CAR-30: a mismatching terminal result cannot claim a finished game', async () => {
  const game={gameId:'gridcannon',sessionId:'active'};
  const {storage}=storageFixture({game,result:{gameId:'gridcannon',sessionId:'other',outcome:'loss'}});
  await assert.rejects(()=>readCatalogGameProgress(storage,'gridcannon'),/Inconsistent/);
});
test('CAR-30: local storage error propagates and never triggers a mutation', async () => {
  const {storage,writes}=storageFixture({reject:true});
  await assert.rejects(()=>readCatalogGameProgress(storage,'gridcannon'),/unavailable/);
  assert.deepEqual(writes,[]);
});
test('CAR-30: new, play and resume are disallowed for the five unavailable game interfaces', () => {
  for(const game of games) for(const indicator of ['none','active','finished']){
    const result=availableGameActions(game,{indicator,statistics:null});
    assert.deepEqual(result,{play:false,resume:false,newGame:false});
  }
});
test('CAR-30: availability guard requires a published internal route and a saved active session to resume', () => {
  const ready={status:'available',playableRoute:'/games/grim-delve'};
  assert.deepEqual(availableGameActions(ready,{indicator:'none',statistics:null}),{
    play:true,resume:false,newGame:true,
  });
  assert.deepEqual(availableGameActions(ready,{indicator:'active',statistics:null}),{
    play:true,resume:true,newGame:true,
  });
  assert.equal(availableGameActions({...ready,playableRoute:'//attacker.example'},{
    indicator:'active',statistics:null,
  }).resume,false);
});
test('CAR-30: statistics keep abandonment separate from normal victory rate', () => {
  assert.equal(victoryRate(null),'—');
  assert.equal(victoryRate({gameId:'gridcannon',played:8,won:0,lost:0,abandoned:8}),'—');
  assert.equal(victoryRate({gameId:'gridcannon',played:8,won:3,lost:1,abandoned:4}),'75 %');
  assert.equal(victoryRate({gameId:'gridcannon',played:3,won:0,lost:3,abandoned:0}),'0 %');
});
