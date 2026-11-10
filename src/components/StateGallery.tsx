import { Context } from "../state/context";
import type { Model, Page } from "../types";
import type { ReactNode } from "react";
import { LimitDialog } from "./LimitDialog";
export function StateGallery({
  model,
  renderScreen,
}: {
  model: Model;
  renderScreen: (page: Page) => ReactNode;
}) {
  const cases: { name: string; page: Page; override: Partial<Model> }[] = [
    {
      name: "Offline · команды заблокированы",
      page: "home",
      override: { link: "offline" },
    },
    {
      name: "Loading · мощность неизвестна",
      page: "home",
      override: { link: "loading" },
    },
    {
      name: "Error · восстановление демо",
      page: "home",
      override: { link: "error" },
    },
    {
      name: "Свет выключен · CH2",
      page: "lighting",
      override: { channels: { CH1: false, CH2: false, CH3: true } },
    },
    {
      name: "Основной свет включён · CH1",
      page: "device",
      override: { channels: { CH1: true, CH2: false, CH3: true } },
    },
    {
      name: "Нет событий · пустая сессия",
      page: "journal",
      override: { events: [] },
    },
    {
      name: "Нужно разрешение · автопилот",
      page: "autopilot",
      override: { auto: false },
    },
    {
      name: "CH3 · offline / защищён",
      page: "protected",
      override: { link: "offline" },
    },
  ];
  return (
    <>
      {cases.map((c, i) => (
        <div className="gallery-item" key={c.name} data-route={`state-${i}`}>
          <span className="gallery-title">{c.name}</span>
          <div className="phone-frame">
            <Context.Provider value={{ ...model, ...c.override }}>
              {renderScreen(c.page)}
            </Context.Provider>
          </div>
        </div>
      ))}
      <div className="gallery-item" data-route="state-overload">
        <span className="gallery-title">Перегрузка · 8,4 Вт · отказ</span>
        <div className="phone-screen state-dialog-review">
          <LimitDialog onClose={() => model.toast("Изменение не применено")} />
        </div>
      </div>
    </>
  );
}
