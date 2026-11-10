export type ChannelId = "CH1" | "CH2" | "CH3";
export type ChannelState = { CH1: boolean; CH2: boolean; CH3: true };
export type LinkState = "online" | "offline" | "loading" | "error";
export const nominal = { CH1: 1.8, CH2: 4.2, CH3: 2.4 };
export const initialChannels: ChannelState = {
  CH1: false,
  CH2: true,
  CH3: true,
};
export function readChannels(raw: string | null): ChannelState {
  try {
    const value = JSON.parse(raw || "null");
    if (
      value &&
      typeof value.CH1 === "boolean" &&
      typeof value.CH2 === "boolean" &&
      value.CH3 === true
    ) {
      const next: ChannelState = { CH1: value.CH1, CH2: value.CH2, CH3: true };
      if (totalWatts(next) <= 7) return next;
    }
  } catch {
    /* Invalid local data is never trusted. */
  }
  return { ...initialChannels };
}
export function readConsent(raw: string | null): {
  CH1: boolean;
  CH2: boolean;
} {
  try {
    const v = JSON.parse(raw || "null");
    return { CH1: v?.CH1 === true, CH2: v?.CH2 === true };
  } catch {
    return { CH1: false, CH2: false };
  }
}
export function totalWatts(channels: ChannelState): number {
  return (
    Math.round(
      Object.entries(channels).reduce(
        (sum, [id, on]) => sum + (on ? nominal[id as ChannelId] : 0),
        0,
      ) * 10,
    ) / 10
  );
}
export function requestSwitch(
  channels: ChannelState,
  id: ChannelId,
  link: LinkState,
  limit = 7,
):
  | { ok: true; next: ChannelState }
  | { ok: false; reason: "protected" | "offline" | "busy" | "limit" } {
  if (id === "CH3") return { ok: false, reason: "protected" };
  if (link === "loading") return { ok: false, reason: "busy" };
  if (link !== "online") return { ok: false, reason: "offline" };
  const next = { ...channels, [id]: !channels[id] };
  if (totalWatts(next) > limit) return { ok: false, reason: "limit" };
  return { ok: true, next };
}
