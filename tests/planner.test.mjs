import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlan, readPlans, loadSegments } from "../src/lib/planner.ts";
const plan = {
  id: 1,
  channel: "CH2",
  time: "19:00",
  end: "22:30",
  name: "Вечерний свет",
  enabled: true,
  days: ["Вт"],
};
test("valid plan is accepted; protected, malformed and empty inputs are rejected", () => {
  assert.equal(validatePlan(plan, []), null);
  for (const bad of [
    { channel: "CH3" },
    { time: "" },
    { end: "18:00" },
    { time: "25:00" },
    { days: [] },
    { days: ["oops"] },
  ])
    assert.ok(validatePlan({ ...plan, ...bad }, []));
});
test("overlapping CH1 + CH2 is rejected; same channel, different days and adjacent intervals are safe", () => {
  const next = { ...plan, id: 2, channel: "CH1" };
  assert.match(validatePlan(next, [plan]), /8,4/);
  assert.equal(validatePlan({ ...next, days: ["Ср"] }, [plan]), null);
  assert.equal(
    validatePlan({ ...next, time: "22:30", end: "23:00" }, [plan]),
    null,
  );
  assert.equal(validatePlan({ ...plan, id: 2 }, [plan]), null);
  assert.equal(validatePlan({ ...next, enabled: false }, [plan]), null);
});
test("timeline reflects active schedules and immutable CH3, counting each channel once", () => {
  assert.deepEqual(loadSegments([], "Вт"), [
    { start: 0, end: 1440, watts: 2.4 },
  ]);
  const segments = loadSegments([plan, { ...plan, id: 2 }], "Вт");
  assert.deepEqual(segments, [
    { start: 0, end: 1140, watts: 2.4 },
    { start: 1140, end: 1350, watts: 6.6 },
    { start: 1350, end: 1440, watts: 2.4 },
  ]);
  assert.deepEqual(
    loadSegments([{ ...plan, enabled: false }], "Вт"),
    loadSegments([], "Вт"),
  );
});
test("stored plans are validated, with unsafe and malformed entries removed", () => {
  assert.deepEqual(readPlans("null"), []);
  assert.deepEqual(readPlans("{"), []);
  assert.deepEqual(
    readPlans(
      JSON.stringify([
        plan,
        { ...plan, id: 2, channel: "CH3" },
        { ...plan, id: 3, channel: "CH1" },
      ]),
    ),
    [plan],
  );
});
