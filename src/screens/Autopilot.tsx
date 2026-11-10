import { useState } from "react";
import {
  ArrowUpRight,
  Sun,
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

export function Autopilot({
  initialAllow,
}: {
  initialAllow?: { CH1: boolean; CH2: boolean };
}) {
  const { auto, setAuto, go, toast, link, record } = useApp();
  const [allow, setAllow] = useState<{ CH1: boolean; CH2: boolean }>(() => {
    if (initialAllow) return initialAllow;
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
          title="Правила света"
          subtitle="Вы решаете, каким каналам доверять демо-правила."
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
          <div className="autopilot-headline">
            <div>
              <span className="eyebrow">ДЕМО-АВТОПИЛОТ</span>
              <h2>{auto ? "Правила разрешены" : "Сначала — разрешение"}</h2>
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
              : "Выберите каналы ниже. Автопилот не отправляет фоновые команды."}
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
            <span>
              <b>01</b> 19:00 · условие
            </span>
            <ArrowRight size={12} />
            <span>
              <b>02</b> Разрешение CH2
            </span>
            <ArrowRight size={12} />
            <span>
              <b>03</b> Нагрузка ≤ 7 Вт
            </span>
            <ArrowRight size={12} />
            <span className={allow.CH2 ? "policy-allowed" : "policy-blocked"}>
              <b>04</b>{" "}
              {allow.CH2
                ? "LED-лента · предполагается включение"
                : "Стоп · нет разрешения CH2"}
            </span>
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
            <h3>План нагрузки</h3>
            <p>Проверить интервалы и безопасный пик</p>
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
