// Illustrative profiles, never measured hardware telemetry.
export type Period = "День" | "Неделя" | "Месяц";
export const data: Record<Period, number[]> = {
  День: [
    4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 6.6, 6.6, 6.6, 4.2, 4.2, 4.2, 4.2,
    4.2, 4.2, 6.6, 6.6, 6.6, 6.6, 6.6, 4.2, 4.2,
  ],
  Неделя: [0.1, 0.13, 0.11, 0.14, 0.16, 0.15, 0.12],
  Месяц: [0.72, 0.91, 0.83, 0.84],
};
export const totals = { День: 0.12, Неделя: 0.91, Месяц: 3.3 };
// 24 hourly W samples integrate to 120 Wh. CH3 is always 2.4 W.
// Weekly share is compatible with 100 h LED + 48.22 h CH1; they do not overlap.
export const shares: Record<Period, { CH1: number; CH2: number; CH3: number }> =
  {
    День: { CH3: 48, CH2: 28, CH1: 24 },
    Неделя: { CH3: 44, CH2: 46, CH1: 10 },
    Месяц: { CH3: 52, CH2: 38, CH1: 10 },
  };

// Exact illustrative allocation. CH3 integrates for the full period; the remainder
// belongs to CH1/CH2, with no claim of measured telemetry or savings.
export const channelEnergy: Record<
  Period,
  { CH1: number; CH2: number; CH3: number }
> = {
  День: { CH3: 0.0576, CH2: 0.0336, CH1: 0.0288 },
  Неделя: { CH3: 0.4032, CH2: 0.42, CH1: 0.0868 },
  Месяц: { CH3: 1.728, CH2: 1.26, CH1: 0.312 },
};

export function chartScale(period: Period) {
  const max = period === "День" ? 8 : period === "Неделя" ? 0.2 : 1.2;
  return {
    max,
    ticks: [max, max * 0.75, max * 0.5, max * 0.25, 0],
    y: (v: number) => 184 - (v / max) * 164,
  };
}
