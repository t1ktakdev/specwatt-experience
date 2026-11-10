import {
  ArrowUpRight,
  ChevronRight,
  Sun,
  Lightbulb,
  ShieldCheck,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { totalWatts } from "../model";
import { useApp } from "../state/context";
import { fmt, visuals } from "../lib/design";
import {
  Header,
  DemoBadge,
  SectionTitle,
  Nav,
  SystemState,
  ConnectionBanner,
  DeviceCard,
} from "../components/ui";
import { PowerGauge } from "../components/charts";

export function Home() {
  const { channels, go, link } = useApp();
  const watts = totalWatts(channels);
  return (
    <>
      <main className="screen-content home-content">
        <Header title="Добрый вечер." action="journal" />
        <SystemState />
        <ConnectionBanner />
        <section className="energy-hero material">
          <div className="energy-hero-top">
            <span>
              <span className="connection-dot" />
              МОЩНОСТЬ СЕЙЧАС
            </span>
            <DemoBadge compact />
          </div>
          <div className="energy-hero-main">
            <div>
              <div className="hero-number">
                {link === "online" ? fmt(watts) : "—"}
                <span>Вт</span>
              </div>
              <p>
                {link === "online"
                  ? `Резерв ${fmt(7 - watts)} Вт до лимита`
                  : "Нет актуальных измерений"}
              </p>
            </div>
            <PowerGauge value={link === "online" ? watts : null} />
          </div>
          <button className="energy-hero-foot" onClick={() => go("energy")}>
            <span>
              Сегодня{" "}
              <b>
                0,12 <small>кВт·ч</small>
              </b>
            </span>
            <span>
              Аналитика
              <ArrowUpRight size={16} />
            </span>
          </button>
        </section>
        <SectionTitle action="Все устройства" onClick={() => go("devices")}>
          Под вашим контролем
        </SectionTitle>
        <div className="device-grid">
          <DeviceCard
            id="CH1"
            title="Светильник"
            detail="Основной свет"
            icon={Lightbulb}
          />
          <DeviceCard
            id="CH2"
            title="LED-лента"
            detail="Атмосферный свет"
            icon={Sun}
          />
        </div>
        <button className="ambient-tile" onClick={() => go("lighting")}>
          <img
            src={visuals.home}
            alt="Скульптурный световой объект из бронзы и дымчатого стекла"
            width="480"
            height="220"
          />
          <div />
          <span>
            <small>LIGHT / CONCEPT</small>
            <strong>Ваш тихий вечер.</strong>
            <em>
              Управлять освещением
              <ArrowUpRight size={16} />
            </em>
          </span>
        </button>
        <div className="quick-actions">
          <button onClick={() => go("planner")}>
            <CalendarDays size={18} />
            <span>План нагрузки</span>
            <ArrowUpRight size={15} />
          </button>
          <button onClick={() => go("autopilot")}>
            <Sparkles size={18} />
            <span>Автопилот</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
        <button className="protection-line" onClick={() => go("protected")}>
          <span className="shield-mini">
            <ShieldCheck size={20} />
          </span>
          <span>
            <b>CH3 под защитой</b>
            <small>Всегда вне автоматизации</small>
          </span>
          <ChevronRight size={17} />
        </button>
      </main>
      <Nav active="home" />
    </>
  );
}
