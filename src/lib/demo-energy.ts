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
