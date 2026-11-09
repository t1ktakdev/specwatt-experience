import { useState } from "react";
import {
  ArrowUpRight,
  Sun,
  ShieldCheck,
  Sparkles,
  Radio,
  Activity,
  LucideIcon,
} from "lucide-react";
import { LogEntry } from "../types";
import { useApp } from "../state/context";
import { Icon, Header, DemoBadge, Nav } from "../components/ui";

export function Journal() {
  const { events, go } = useApp();
  const [filter, setFilter] = useState("Все");
  const filtered =
    filter === "Защита" ? events.filter((e) => e.kind === "shield") : events;
  const icons: Record<LogEntry["kind"], LucideIcon> = {
    light: Sun,
    shield: ShieldCheck,
    auto: Sparkles,
    system: Radio,
  };
  return (
    <>
      <main className="screen-content journal-content">
        <Header
          title="Всё на виду."
          subtitle="Понятная история решений и действий."
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
          {["Все", "Защита"].map((f) => (
            <button
              className={f === filter ? "active" : ""}
              onClick={() => setFilter(f)}
              key={f}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="journal-date">
          <span>Сегодня</span>
          <DemoBadge compact />
        </div>
        <div className="event-timeline">
          {filtered.map((e, i) => (
            <article
              className={`event-item event-${e.kind}`}
              key={`${e.title}-${i}`}
            >
              <span className="event-node">
                <Icon icon={icons[e.kind]} size={21} />
              </span>
              <div>
                <time>{e.time}</time>
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
