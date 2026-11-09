export type ChannelId = "CH1" | "CH2" | "CH3";
export type ChannelState = { CH1: boolean; CH2: boolean; CH3: true };
export type LinkState = "online" | "offline" | "loading" | "error";
export const nominal = { CH1: 1.8, CH2: 4.2, CH3: 2.4 };
export const initialChannels: ChannelState = {
  CH1: false,
  CH2: true,
  CH3: true,
};
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
