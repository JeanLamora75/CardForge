import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const server=await createServer({
  configFile:false,
  plugins:[(await import('@vitejs/plugin-react')).default()],
  server:{host:'127.0.0.1',port:4387,strictPort:true},
  appType:'spa',
  logLevel:'error',
});
let browser;
try{
  await server.listen();
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext();
  const base='http://127.0.0.1:4387/';
  const dbName='cardforge-car41-real-chromium-'+Date.now();
  const first=await context.newPage();
  await first.goto(base);
  const saved=await first.evaluate(async({dbName})=>{
    const [{createIndexedDbGameStorage},{startPersistentGame},
      {grimDelveEngine,GRIM_DELVE_RULES_VERSION},
      {thunderfighterEngine,THUNDERFIGHTER_RULES_VERSION}]=await Promise.all([
        import('/src/adapters/indexeddb-game-storage.ts'),
        import('/src/application/persistent-game-session.ts'),
        import('/src/games/clear-the-dungeon/engine.ts'),
        import('/src/games/gridcannon/engine.ts')]);
    const store=createIndexedDbGameStorage({name:dbName});
    const grim=await startPersistentGame(grimDelveEngine,store,{
      gameId:'clear-the-dungeon',sessionId:'chromium-grim',rulesVersion:GRIM_DELVE_RULES_VERSION,formatVersion:1,
    },{seed:98});
    const thunder=await startPersistentGame(thunderfighterEngine,store,{
      gameId:'gridcannon',sessionId:'chromium-thunder',rulesVersion:THUNDERFIGHTER_RULES_VERSION,formatVersion:1,
    },{seed:104});
    const ga=grim.getLegalActions()[0],ta=thunder.getLegalActions()[0];
    if(!ga||!ta)throw Error('Both actual engines must offer a legal action');
    await grim.dispatch(ga);await thunder.dispatch(ta);
    return {grim:grim.getState(),thunder:thunder.getState()};
  },{dbName});
  await first.close();
  const tab1=await context.newPage();
  const tab2=await context.newPage();
  await Promise.all([tab1.goto(base),tab2.goto(base)]);
  const resumed=await tab1.evaluate(async({dbName})=>{
    const [{createIndexedDbGameStorage},{resumePersistentGame},
      {grimDelveEngine,GRIM_DELVE_RULES_VERSION},
      {thunderfighterEngine,THUNDERFIGHTER_RULES_VERSION}]=await Promise.all([
        import('/src/adapters/indexeddb-game-storage.ts'),
        import('/src/application/persistent-game-session.ts'),
        import('/src/games/clear-the-dungeon/engine.ts'),
        import('/src/games/gridcannon/engine.ts')]);
    const store=createIndexedDbGameStorage({name:dbName});
    const grim=await resumePersistentGame(grimDelveEngine,store,
      {gameId:'clear-the-dungeon',rulesVersion:GRIM_DELVE_RULES_VERSION,formatVersion:1});
    const thunder=await resumePersistentGame(thunderfighterEngine,store,
      {gameId:'gridcannon',rulesVersion:THUNDERFIGHTER_RULES_VERSION,formatVersion:1});
    return {grim:grim.getState(),thunder:thunder.getState()};
  },{dbName});
  assert.deepEqual(resumed,saved,'closing and reopening the real browser tab must preserve both exact engine snapshots');
  // Arrange a validated, nearly-completed real Grim Delve state in the shared browser DB.
  const prepared=await tab1.evaluate(async({dbName})=>{
    const [{createIndexedDbGameStorage},{grimDelveEngine},{makeDeckWithJokers}]=await Promise.all([
      import('/src/adapters/indexeddb-game-storage.ts'),
      import('/src/games/clear-the-dungeon/engine.ts'),
      import('/src/core/cards.ts')]);
    const storage=createIndexedDbGameStorage({name:dbName});
    const previous=await storage.readGame('clear-the-dungeon');
    const initial=grimDelveEngine.createInitialState({seed:23});
    const monsterId=initial.columns[0][0];
    const defeated=initial.columns.flat().filter(id=>id!==monsterId);
    const power=makeDeckWithJokers().filter(card=>'kind'in card||card.rank<=10).map(card=>card.id);
    const remaining=power.filter(id=>!['joker-1','clubs-3','joker-2'].includes(id));
    const removed=remaining.slice(0,33),other=remaining.slice(33);
    const hand=['joker-2',other[0]],drawPile=other.slice(1,6);
    const state={...initial,columns:[[monsterId],[],[],[]],visibleMonsters:[monsterId,null,null,null],
      defeated,removed,hand,drawPile,
      damages:other.filter(id=>!hand.includes(id)&&!drawPile.includes(id)),
      attacks:[{monsterId,powers:[{cardId:'joker-1',handNumber:1},{cardId:'clubs-3',handNumber:1}]}]};
    if(!grimDelveEngine.validateState(state).valid)throw Error('Invalid terminal fixture');
    await storage.commit({save:{...previous,state}});
    return {monsterId};
  },{dbName});
  async function complete(tab){
    return tab.evaluate(async({dbName,monsterId})=>{
      const [{createIndexedDbGameStorage},{resumePersistentGame},
        {grimDelveEngine,GRIM_DELVE_RULES_VERSION}]=await Promise.all([
          import('/src/adapters/indexeddb-game-storage.ts'),
          import('/src/application/persistent-game-session.ts'),
          import('/src/games/clear-the-dungeon/engine.ts')]);
      const storage=createIndexedDbGameStorage({name:dbName});
      const session=await resumePersistentGame(grimDelveEngine,storage,
        {gameId:'clear-the-dungeon',rulesVersion:GRIM_DELVE_RULES_VERSION,formatVersion:1});
      const result=await session.dispatch({type:'trigger-attack',cardId:'joker-2',monsterId});
      return {accepted:result.accepted,outcome:session.getOutcome(),status:session.getSaveStatus()};
    },{dbName,monsterId:prepared.monsterId});
  }
  const both=await Promise.allSettled([complete(tab1),complete(tab2)]);
  assert.ok(both.some(x=>x.status==='fulfilled'&&x.value.outcome==='win'),
    'At least one tab must complete the game');
  const final=await tab2.evaluate(async({dbName})=>{
    const [{createIndexedDbGameStorage},{stableResultId}]=await Promise.all([
      import('/src/adapters/indexeddb-game-storage.ts'),
      import('/src/ports/local-storage.ts')]);
    const store=createIndexedDbGameStorage({name:dbName});
    return {result:await store.readResult(stableResultId('clear-the-dungeon','chromium-grim')),
      stats:await store.readStatistics('clear-the-dungeon'),
      other:await store.readGame('gridcannon')};
  },{dbName});
  assert.equal(final.result?.outcome,'win');
  assert.equal(final.result?.score,5);
  assert.deepEqual(final.stats,{gameId:'clear-the-dungeon',played:1,won:1,lost:0,abandoned:0});
  assert.deepEqual(final.other.state,saved.thunder);
  // UI-level error handling: an incompatible snapshot remains intact and is explained to the player.
  const ui=await context.newPage();
  await ui.goto(base);
  const incompatible=await ui.evaluate(async()=>{
    const [{createIndexedDbGameStorage},{grimDelveEngine}]=await Promise.all([
      import('/src/adapters/indexeddb-game-storage.ts'),
      import('/src/games/clear-the-dungeon/engine.ts')]);
    const storage=createIndexedDbGameStorage();
    const save={gameId:'clear-the-dungeon',sessionId:'ui-incompatible',
      rulesVersion:'unknown-future-rules',formatVersion:1,
      state:grimDelveEngine.createInitialState({seed:19})};
    await storage.commit({save});
    localStorage.setItem('cardforge.learning.v1.clear-the-dungeon',
      JSON.stringify({choice:'play',hintsEnabled:true}));
    return save;
  });
  await ui.goto(base+'#game/clear-the-dungeon/board');
  await ui.getByText('Cette sauvegarde utilise des règles incompatibles ou un format inconnu.',{exact:false})
    .waitFor({state:'visible',timeout:20000});
  const retained=await ui.evaluate(async()=>{
    const {createIndexedDbGameStorage}=await import('/src/adapters/indexeddb-game-storage.ts');
    return createIndexedDbGameStorage().readGame('clear-the-dungeon');
  });
  assert.deepEqual(retained,incompatible,'UI refusal must preserve the incompatible durable snapshot');
  await ui.close();
  await tab1.close();await tab2.close();await context.close();
  console.log('CAR-41 Chromium: both games restored; two tabs wrote one terminal result/statistic; incompatible save visibly explained and preserved.');
}finally{
  if(browser)await browser.close();
  await server.close();
}
