import { test } from "node:test";
import assert from "node:assert/strict";
import * as energy from "../src/lib/demo-energy.ts";

test("channel energy integrates the protected base for the actual period duration", () => {
  assert.ok(
    energy.channelEnergy,
    "channelEnergy must contain exact kWh, not rounded percentages",
  );
  for (const [period, hours] of [
    ["День", 24],
    ["Неделя", 168],
    ["Месяц", 720],
  ]) {
    const e = energy.channelEnergy[period];
    assert.ok(Math.abs(e.CH3 - (2.4 * hours) / 1000) < 1e-9);
    assert.ok(Math.abs(e.CH1 + e.CH2 + e.CH3 - energy.totals[period]) < 1e-9);
    assert.equal(
      Object.values(energy.shares[period]).reduce((a, b) => a + b, 0),
      100,
    );
  }
});

test("chart domain and ticks share an exact affine scale", () => {
  assert.equal(typeof energy.chartScale, "function");
  for (const period of Object.keys(energy.data)) {
    const scale = energy.chartScale(period);
    assert.ok(scale.max >= Math.max(...energy.data[period]));
    assert.equal(scale.y(0), 184);
    assert.equal(scale.y(scale.max), 20);
    for (const tick of scale.ticks)
      assert.equal(scale.y(tick), 184 - (tick / scale.max) * 164);
  }
});
