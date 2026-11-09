import { test } from "node:test";
import assert from "node:assert/strict";
import { initialChannels, totalWatts, requestSwitch } from "../src/model.ts";
import { data, totals, shares } from "../src/lib/demo-energy.ts";
test("демо-профили энергии согласованы с итогами и лимитом", () => {
  assert.ok(
    Math.abs(data.День.reduce((a, b) => a + b, 0) / 1000 - totals.День) < 1e-9,
  );
  for (const period of ["Неделя", "Месяц"])
    assert.ok(
      Math.abs(data[period].reduce((a, b) => a + b, 0) - totals[period]) < 1e-9,
    );
  for (const v of data.День) assert.ok(v <= 7 && [2.4, 4.2, 6.6].includes(v));
  for (const values of Object.values(shares))
    assert.equal(
      Object.values(values).reduce((a, b) => a + b, 0),
      100,
    );
});
test("демо начинает с 6,6 Вт, сумма соответствует каналам", () =>
  assert.equal(totalWatts(initialChannels), 6.6));
test("защищённый CH3 невозможно переключить при любом соединении", () => {
  for (const link of ["online", "offline", "loading", "error"])
    assert.deepEqual(requestSwitch(initialChannels, "CH3", link), {
      ok: false,
      reason: "protected",
    });
});
test("запрос выше лимита не меняет состояние", () => {
  const before = { ...initialChannels };
  assert.deepEqual(requestSwitch(initialChannels, "CH1", "online"), {
    ok: false,
    reason: "limit",
  });
  assert.deepEqual(initialChannels, before);
});
test("после выключения LED основной свет доступен, CH3 сохранён", () => {
  const off = requestSwitch(initialChannels, "CH2", "online");
  assert.equal(off.ok, true);
  const on = requestSwitch(off.next, "CH1", "online");
  assert.equal(on.ok, true);
  assert.equal(totalWatts(on.next), 4.2);
  assert.equal(on.next.CH3, true);
});
test("offline и error запрещают команды; loading даёт busy", () => {
  for (const link of ["offline", "error"])
    assert.deepEqual(requestSwitch(initialChannels, "CH2", link), {
      ok: false,
      reason: "offline",
    });
  assert.deepEqual(requestSwitch(initialChannels, "CH2", "loading"), {
    ok: false,
    reason: "busy",
  });
});
