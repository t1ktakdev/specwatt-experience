import { useState } from "react";
import {
  Sun,
  Lightbulb,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useApp } from "../state/context";
import { Icon, Header, DemoBadge, SectionTitle, Nav } from "../components/ui";
import { Period, EnergyChart } from "../components/charts";
import { shares, totals, channelEnergy } from "../lib/demo-energy";
import { fmtEnergy } from "../lib/design";

export function Energy({
  initialPeriod = "Неделя",
}: {
  initialPeriod?: Period;
}) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const { go } = useApp();
  const value = totals[period].toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <>
      <main className="screen-content energy-content">
        <Header title="Энергия в деталях" action="none" />
        <div className="period-tabs">
          {(["День", "Неделя", "Месяц"] as Period[]).map((p) => (
            <button
              className={p === period ? "active" : ""}
              aria-pressed={p === period}
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
          <span className="analytics-context">
            <span>
              {period === "День"
                ? "24 часовых интервала"
                : period === "Неделя"
                  ? "7 дней · учебный профиль"
                  : "30 дней · учебный профиль"}
            </span>
            <b>{fmtEnergy(totals[period] * 1000)} Вт·ч</b>
          </span>
        </section>
        <section className="chart-section material">
          <div className="chart-heading">
            <h2>
              {period === "День"
                ? "Средняя мощность по часам"
                : "Энергия по интервалам"}
            </h2>
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
                ? "2–8 ноября"
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
                <span className="consumer-amount">
                  {fmtEnergy(
                    channelEnergy[period][c.id as "CH1" | "CH2" | "CH3"] * 1000,
                  )}{" "}
                  Вт·ч
                </span>
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
