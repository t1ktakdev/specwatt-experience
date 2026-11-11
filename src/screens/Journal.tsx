import { useState } from "react";
import {
  ArrowUpRight,
  Sun,
  ShieldCheck,
  Sparkles,
  Radio,
  Activity,
  LucideIcon,
  TriangleAlert,
  Inbox,
} from "lucide-react";
import { LogEntry } from "../types";
import { useApp } from "../state/context";
import { Icon, Header, DemoBadge, Nav } from "../components/ui";

export function Journal() {
  const { events, go } = useApp();
  const [filter, setFilter] = useState("Все");
  const kinds: Record<string, LogEntry["kind"][]> = {
    Все: ["light", "shield", "auto", "system", "warning"],
    Защита: ["shield", "warning"],
    Управление: ["light"],
    Авто: ["auto"],
  };
  const filtered = events.filter((e) => kinds[filter].includes(e.kind));
  const groups = Object.entries(
    filtered.reduce<Record<string, LogEntry[]>>((groups, event) => {
      (groups[event.time] ||= []).push(event);
      return groups;
    }, {}),
  );
  const icons: Record<LogEntry["kind"], LucideIcon> = {
    light: Sun,
    shield: ShieldCheck,
    auto: Sparkles,
    system: Radio,
    warning: TriangleAlert,
  };
  return (
    <>
      <main className="screen-content journal-content">
        <Header
          title="Журнал событий"
          subtitle="Действия и решения текущей демо-сессии"
          back
          action="none"
        />
        <div className="journal-summary">
          <span className="journal-number">
            {String(events.length).padStart(2, "0")}
          </span>
          <div>
            <span>СОБЫТИЯ ДЕМО-СЕССИИ</span>
            <p>
              <ShieldCheck size={14} />
              CH3 защищён
            </p>
          </div>
          <Activity size={27} />
        </div>
        <div className="filter-chips">
          {Object.keys(kinds).map((f) => (
            <button
              className={f === filter ? "active" : ""}
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
              key={f}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="journal-date">
          <span>
            Сегодня ·{" "}
            {new Date().toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
            })}
          </span>
          <DemoBadge compact />
        </div>
        <div className="event-timeline">
          {filtered.length === 0 && (
            <div className="timeline-empty">
              <Inbox size={28} />
              <h3>История ещё впереди.</h3>
              <p>
                В этом разделе появятся ваши действия в текущей демо-сессии.
              </p>
            </div>
          )}
          {groups.map(([time, items]) => (
            <section className="journal-group" key={time}>
              <div className="journal-time-group">
                <time>{time}</time>
                <span>ЛОКАЛЬНАЯ СЕССИЯ</span>
              </div>
              {items!.map((e, i) => (
                <article
                  className={`event-item event-${e.kind}`}
                  key={`${e.title}-${i}`}
                >
                  <span className="event-node">
                    <Icon icon={icons[e.kind]} size={21} />
                  </span>
                  <div>
                    <span className="event-receipt">
                      {e.kind === "warning"
                        ? "ЗАПРОС ОТКЛОНЁН"
                        : e.kind === "shield"
                          ? "ЗАЩИТА"
                          : e.kind === "auto"
                            ? "РАЗРЕШЕНИЕ"
                            : "ЛОКАЛЬНО"}
                      {e.channel ? ` / ${e.channel}` : ""}
                    </span>
                    <h3>{e.title}</h3>
                    <p>{e.detail}</p>
                    {e.kind === "shield" && (
                      <button onClick={() => go("protected")}>
                        Как работает защита
                        <ArrowUpRight size={13} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
        <div className="session-ledger">
          <span className="eyebrow">ПРОЗРАЧНОСТЬ КАЖДОГО ДЕЙСТВИЯ</span>
          <h2>
            У каждого решения —<br />
            свой след.
          </h2>
          <div className="ledger-counts">
            <span>
              <b>{events.filter((e) => e.kind === "light").length}</b>
              Переключения
            </span>
            <span>
              <b>{events.filter((e) => e.kind === "warning").length}</b>Отказы
            </span>
            <span>
              <b>{events.filter((e) => e.kind === "auto").length}</b>Разрешения
            </span>
          </div>
          <button onClick={() => go("devices")}>
            К управлению устройствами <ArrowUpRight size={17} />
          </button>
        </div>
        <p className="fine-note">
          Журнал этой сессии содержит только действия в прототипе. Он не
          подтверждает отправку команд оборудованию.
        </p>
      </main>
      <Nav active="home" />
    </>
  );
}
