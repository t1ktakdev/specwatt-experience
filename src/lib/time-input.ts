/** Numeric mobile keyboards can enter four digits without a colon key. */
export function formatTimeInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
}
