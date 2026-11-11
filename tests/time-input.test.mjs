import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTimeInput } from "../src/lib/time-input.ts";
import { validatePlan } from "../src/lib/planner.ts";
test("numeric keyboards enter 24-hour times without needing a colon key", () => {
  assert.equal(formatTimeInput("1945"), "19:45");
  assert.equal(formatTimeInput("09:05"), "09:05");
  assert.equal(formatTimeInput("12"), "12");
  assert.equal(formatTimeInput("12:"), "12");
});
test("formatted invalid hours still fail the shared safety validator", () => {
  const invalid = {
    id: 1,
    name: "Поздний свет",
    channel: "CH1",
    time: formatTimeInput("2400"),
    end: "23:59",
    days: ["Пн"],
    enabled: true,
  };
  assert.match(validatePlan(invalid, []), /время/);
});
