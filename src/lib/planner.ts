import { nominal } from "../model.ts";

export const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export type Schedule = {
  id: number;
  channel: "CH1" | "CH2";
  time: string;
  end: string;
  name: string;
  enabled: boolean;
  days: string[];
};
export type LoadSegment = { start: number; end: number; watts: number };
export const minute = (time: string) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const validTime = (value: unknown): value is string =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
function isPlan(value: unknown): value is Schedule {
  if (!value || typeof value !== "object") return false;
  const p = value as Schedule;
  return (
    Number.isSafeInteger(p.id) &&
    ["CH1", "CH2"].includes(p.channel) &&
    validTime(p.time) &&
    validTime(p.end) &&
    p.time < p.end &&
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    p.name.length <= 60 &&
    typeof p.enabled === "boolean" &&
    Array.isArray(p.days) &&
    p.days.length > 0 &&
    p.days.every((d) => weekdays.includes(d))
  );
}
export function loadSegments(plans: Schedule[], day: string): LoadSegment[] {
  const active = plans.filter((p) => p.enabled && p.days.includes(day));
  const edges = [
    ...new Set([
      0,
      1440,
      ...active.flatMap((p) => [minute(p.time), minute(p.end)]),
    ]),
  ].sort((a, b) => a - b);
  const result: LoadSegment[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const channels = new Set(
      active
        .filter((p) => minute(p.time) <= edges[i] && minute(p.end) > edges[i])
        .map((p) => p.channel),
    );
    const watts =
      Math.round(
        (nominal.CH3 +
          [...channels].reduce((sum, id) => sum + nominal[id], 0)) *
          10,
      ) / 10;
    const previous = result.at(-1);
    if (previous?.watts === watts) previous.end = edges[i + 1];
    else result.push({ start: edges[i], end: edges[i + 1], watts });
  }
  return result;
}
export function validatePlan(
  value: unknown,
  existing: Schedule[],
): string | null {
  if (!isPlan(value))
    return "Проверьте канал, время и дни. Окончание должно быть позже начала в тот же день.";
  if (
    value.enabled &&
    value.days.some((day) =>
      loadSegments(
        [...existing.filter((p) => p.id !== value.id), value],
        day,
      ).some((s) => s.watts > 7),
    )
  )
    return "Пересечение CH1 и CH2 создаст 8,4 Вт при лимите 7 Вт. Измените время или дни.";
  return null;
}
export function readPlans(raw: string | null): Schedule[] {
  try {
    const values: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(values)) return [];
    return values.reduce<Schedule[]>(
      (safe, p) =>
        isPlan(p) && !safe.some((v) => v.id === p.id) && !validatePlan(p, safe)
          ? [...safe, p]
          : safe,
      [],
    );
  } catch {
    return [];
  }
}
