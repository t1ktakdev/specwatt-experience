import { Page } from "../types";

export const fmt = (v: number) =>
  v.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

export const fmtEnergy = (v: number) =>
  v.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

export const scene = "./assets/ambient-room.webp";

export const pageLabels: Record<Page, string> = {
  welcome: "Первое впечатление",
  home: "Главная",
  lighting: "Освещение",
  energy: "Энергия",
  devices: "Устройства",
  device: "Светильник · CH1",
  autopilot: "Автопилот",
  planner: "План нагрузки",
  journal: "Журнал событий",
  setup: "Подключение",
  settings: "Настройки",
  protected: "Защищённый канал",
};
