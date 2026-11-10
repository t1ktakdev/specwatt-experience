import { useState } from "react";
import {
  ArrowUpRight,
  Sun,
  Moon,
  Lightbulb,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../state/context";
import { Icon, Header, SectionTitle, Toggle, Nav } from "../components/ui";
import { readConsent } from "../model";

export function Autopilot() {
  const { auto, setAuto, go, toast, link, record } = useApp();
  const [allow, setAllow] = useState<{ CH1: boolean; CH2: boolean }>(() => {
    try {
      return readConsent(localStorage.getItem("specwatt-consent"));
    } catch {
      return { CH1: false, CH2: false };
    }
  });
  function changeAuto() {
    if (link !== "online") {
      toast("Автоматизация недоступна без соединения");
      return;
    }
    if (!auto && !allow.CH1 && !allow.CH2) {
      toast("Сначала разрешите управление хотя бы одним каналом");
      return;
    }
    setAuto(!auto);
    record({
      title: auto ? "Демо-автопилот выключен" : "Демо-автопилот разрешён",
      detail: "Только концепция · фоновые команды не выполняются",
      kind: "auto",
    });
    toast(
      !auto
        ? "Автопилот включён только в демонстрации"
        : "Демо-автопилот выключен",
    );
  }
  function consent(id: "CH1" | "CH2") {
    const next = { ...allow, [id]: !allow[id] };
    setAllow(next);
    localStorage.setItem("specwatt-consent", JSON.stringify(next));
    record({
      title: `${id}: разрешение ${next[id] ? "выдано" : "отозвано"}`,
      detail:
        "Разрешение для демо-правил · не согласие на команды оборудованию",
      kind: "auto",
      channel: id,
    });
    if (!next.CH1 && !next.CH2) setAuto(false);
  }
  return (
    <>
      <main className="screen-content autopilot-content">
        <Header
          title="В вашем ритме"
          subtitle="Вы задаёте правила. SpecWATT бережёт баланс."
          action="settings"
        />
        <section className={`autopilot-hero material ${auto ? "enabled" : ""}`}>
          <div className="auto-status">
            <i />
            {link !== "online"
              ? "НЕДОСТУПЕН БЕЗ СВЯЗИ"
              : auto
                ? "РАЗРЕШЕНИЕ ПОЛУЧЕНО"
                : "ОЖИДАЕТ ВАШЕГО РЕШЕНИЯ"}
          </div>
          <div className="autopilot-path">
            <span>
              <Sun size={22} />
            </span>
            <i />
            <span className="auto-core">
              <Sparkles size={32} />
            </span>
            <i />
            <span>
              <Moon size={22} />
            </span>
          </div>
          <div className="autopilot-headline">
            <div>
              <span className="eyebrow">ДЕМО-АВТОПИЛОТ</span>
              <h2>
                {auto
                  ? "Разумный баланс."
                  : "Спокойствие —\nпо вашим правилам."}
              </h2>
            </div>
            <Toggle
              label="Демо-автопилот"
              checked={auto}
              onChange={changeAuto}
              disabled={link !== "online"}
            />
          </div>
          <p>
            {auto
              ? "Демо-режим включён. Фоновые команды не выполняются."
              : "Включается только с разрешения.\nВы всегда сохраняете ручной контроль."}
          </p>
        </section>
        <SectionTitle>Разрешённые каналы</SectionTitle>
        <div className="permission-list">
          {(["CH1", "CH2"] as const).map((id) => (
            <div className="permission-row" key={id}>
              <span className={`permission-icon ${allow[id] ? "allowed" : ""}`}>
                <Icon icon={id === "CH1" ? Lightbulb : Sun} />
              </span>
              <span>
                <b>{id === "CH1" ? "Основной свет" : "LED-лента"}</b>
                <small>
                  {id} ·{" "}
                  {allow[id] ? "Управление разрешено" : "Нужно ваше разрешение"}
                </small>
              </span>
              <Toggle
                checked={allow[id]}
                onChange={() => consent(id)}
                label={`Разрешить авто для ${id}`}
              />
            </div>
          ))}
        </div>
        <section className="auto-rule">
          <div className="auto-rule-head">
            <Clock3 size={20} />
            <b>Тихий вечер</b>
            <span>ПРИМЕР ПРАВИЛА</span>
          </div>
          <div className="auto-rule-steps">
            <span>19:00</span>
            <ArrowRight size={12} />
            <span>Есть разрешение</span>
            <ArrowRight size={12} />
            <span>Проверка 7 Вт</span>
          </div>
          <p>
            {!allow.CH2
              ? "Нужно разрешение для CH2. "
              : "Разрешение CH2 выдано. "}
            Предполагаемое действие — включить LED-ленту. В этой версии правило
            не исполняется.
          </p>
        </section>
        <button className="auto-plan" onClick={() => go("planner")}>
          <CalendarDays size={24} />
          <div>
            <small>СЛЕДУЮЩИЙ ШАГ</small>
            <h3>Энергия по расписанию</h3>
            <p>Соберите свой ритм дня</p>
          </div>
          <ArrowUpRight size={20} />
        </button>
        <div className="quiet-facts">
          <span>
            <ShieldCheck size={16} />
            CH3 всегда защищён
          </span>
          <span>
            <SlidersHorizontal size={16} />
            Лимит 7 Вт
          </span>
        </div>
        <p className="fine-note">
          Интерактивная концепция. Запланированные и автоматические команды не
          исполняются по часам.
        </p>
      </main>
      <Nav active="autopilot" />
    </>
  );
}
