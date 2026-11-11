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
import { readConsent, totalWatts } from "../model";
import { fmt } from "../lib/design";

export function Autopilot({
  initialAllow,
}: {
  initialAllow?: { CH1: boolean; CH2: boolean };
}) {
  const { auto, setAuto, go, toast, link, record, channels } = useApp();
  const projected = totalWatts({ ...channels, CH2: true });
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
          <ol className="decision-flow">
            <li>
              <span className="decision-icon">
                <Clock3 size={20} />
              </span>
              <div>
                <small>01 / УСЛОВИЕ</small>
                <strong>Наступает 19:00</strong>
                <p>Учебный триггер · таймер не запущен</p>
              </div>
            </li>
            <li>
              <span className="decision-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <small>02 / ВАШЕ РЕШЕНИЕ</small>
                <strong>Разрешение для CH2</strong>
                <p>
                  {allow.CH2
                    ? "Получено · можно отозвать выше"
                    : "Ожидает вашего согласия"}
                </p>
              </div>
            </li>
            <li>
              <span className="decision-icon">
                <SlidersHorizontal size={20} />
              </span>
              <div>
                <small>03 / ПРОВЕРКА БАЛАНСА</small>
                <strong>
                  {link === "online"
                    ? `${fmt(projected)} Вт из 7 Вт`
                    : "Нагрузка неизвестна"}
                </strong>
                <p>CH3 включён в расчёт · 2,4 Вт</p>
              </div>
            </li>
            <li
              className={
                allow.CH2 && projected <= 7 && link === "online"
                  ? "policy-allowed"
                  : "policy-blocked"
              }
            >
              <span className="decision-icon">
                <ArrowRight size={20} />
              </span>
              <div>
                <small>04 / РЕЗУЛЬТАТ ПРОВЕРКИ</small>
                <strong>
                  {link !== "online"
                    ? "Стоп · нет актуальных данных"
                    : !allow.CH2
                      ? "Стоп · нет разрешения CH2"
                      : projected > 7
                        ? "Стоп · превышен лимит"
                        : "Включение CH2 допустимо"}
                </strong>
                <p>Предпросмотр · действие не выполняется</p>
              </div>
            </li>
          </ol>
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
