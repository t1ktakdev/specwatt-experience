import { useState } from "react";
import {
  ArrowUpRight,
  Sun,
  Lightbulb,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useApp } from "../state/context";
import { Icon, Header, DemoBadge, SectionTitle, Nav } from "../components/ui";
import { MiniSpark, Period, EnergyChart } from "../components/charts";
import { shares } from "../lib/demo-energy";

export function Energy() {
  const [period, setPeriod] = useState<Period>("Неделя");
  const { go } = useApp();
  const value =
    period === "День" ? "0,12" : period === "Неделя" ? "0,91" : "3,30";
  return (
    <>
      <main className="screen-content energy-content">
        <Header title="Энергия в деталях" action="none" />
        <div className="period-tabs">
          {(["День", "Неделя", "Месяц"] as Period[]).map((p) => (
            <button
              className={p === period ? "active" : ""}
              key={p}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <section className="analytics-number">
          <span className="eyebrow">
            ОБЩЕЕ ПОТРЕБЛЕНИЕ <DemoBadge compact />
          </span>
          <div>
            {value}
            <span>кВт·ч</span>
          </div>
          <span className="comparison">
            <ArrowUpRight size={15} />
            <b>−12%</b> к предыдущему периоду
            <MiniSpark />
          </span>
        </section>
        <section className="chart-section material">
          <div className="chart-heading">
            <h2>Ритм потребления</h2>
            <button
              onClick={() => go("journal")}
              aria-label="Открыть журнал измерений"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
          <EnergyChart period={period} />
          <div className="chart-legend">
            <span>
              <i />
              Текущий период
            </span>
            <span>
              {period === "Неделя"
                ? "4–10 ноября"
                : period === "День"
                  ? "10 ноября"
                  : "Ноябрь"}{" "}
              · демо
            </span>
          </div>
        </section>
        <SectionTitle>Куда уходит энергия</SectionTitle>
        <div className="consumer-list">
          {[
            {
              icon: ShieldCheck,
              title: "Защищённый канал",
              id: "CH3",
              percent: shares[period].CH3,
            },
            {
              icon: Sun,
              title: "LED-лента",
              id: "CH2",
              percent: shares[period].CH2,
            },
            {
              icon: Lightbulb,
              title: "Светильник",
              id: "CH1",
              percent: shares[period].CH1,
            },
          ].map((c, i) => (
            <button
              className="consumer-row"
              key={c.id}
              onClick={() =>
                go(
                  c.id === "CH3"
                    ? "protected"
                    : c.id === "CH2"
                      ? "lighting"
                      : "device",
                )
              }
            >
              <span className={`consumer-icon tone-${i}`}>
                <Icon icon={c.icon} size={22} />
              </span>
              <div>
                <span>
                  {c.title}
                  <small>{c.id}</small>
                </span>
                <div className="consumer-track">
                  <i style={{ width: `${c.percent}%` }} />
                </div>
              </div>
              <strong>
                {c.percent}
                <small>%</small>
              </strong>
            </button>
          ))}
        </div>
        <div className="analytics-note">
          <Activity size={18} />
          <p>
            Демо-история для оценки интерфейса.
            <br />
            Показатели не являются телеметрией стенда.
          </p>
        </div>
      </main>
      <Nav active="energy" />
    </>
  );
}
