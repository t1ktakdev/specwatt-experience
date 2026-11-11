import { ChannelId, ChannelState, LinkState } from "./model";

export type Page =
  | "welcome"
  | "home"
  | "lighting"
  | "energy"
  | "devices"
  | "device"
  | "autopilot"
  | "planner"
  | "journal"
  | "setup"
  | "settings"
  | "protected";

export type LogEntry = {
  title: string;
  detail: string;
  time: string;
  kind: "light" | "shield" | "auto" | "system" | "warning";
  channel?: ChannelId;
};

export type Model = {
  page: Page;
  go: (p: Page) => void;
  back: () => void;
  channels: ChannelState;
  toggle: (c: ChannelId) => void;
  link: LinkState;
  setLink: (l: LinkState) => void;
  brightness: number;
  setBrightness: (n: number) => void;
  auto: boolean;
  setAuto: (b: boolean) => void;
  events: LogEntry[];
  record: (entry: Omit<LogEntry, "time">) => void;
  toast: (s: string) => void;
  modal: (s: string) => void;
};
