import test from "node:test";
import assert from "node:assert/strict";
import { statisticsOverview } from "../src/application/statistics-overview.ts";

for (const [won,lost,abandoned,total,rate] of [[0,0,0,0,"—"],[1,0,0,1,"100 %"],[0,1,0,1,"0 %"],[0,0,1,1,"—"],[1,7,2,10,"13 %"],[5,5,10,20,"50 %"],[100,0,50,150,"100 %"],[999,999,999,2997,"50 %"]]) {
  test("statistics overview: "+[won,lost,abandoned].join("/"), () => {
    const source=Object.freeze({gameId:"card-capture",played:total,won,lost,abandoned});
    const s=statisticsOverview(source);
    assert.equal(s.total,total);
    assert.equal(s.rateLabel,rate);
    assert.equal(s.rate,won+lost ? won/(won+lost) : null);
    assert.deepEqual(s.shares,[won,lost,abandoned].map(n=>total?n/total:0));
    assert.deepEqual(source,{gameId:"card-capture",played:total,won,lost,abandoned});
  });
}
test("no stored statistics",()=>assert.equal(statisticsOverview(null).rateLabel,"—"));
