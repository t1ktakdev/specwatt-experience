import {
  ArrowUpRight,
  ChevronRight,
  Sun,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { totalWatts } from "../model";
import { useApp } from "../state/context";
import { fmt, scene } from "../lib/design";
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
                  ? "Нагрузка в пределах лимита"
                  : "Нет актуальных измерений"}
              </p>
            </div>
            <PowerGauge value={link === "online" ? watts : 0} />
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
          <img src={scene} alt="Тёплое освещение гостиной" />
          <div />
          <span>
            <small>СВЕТ СОЗДАЁТ НАСТРОЕНИЕ</small>
            <strong>Ваш тихий вечер.</strong>
            <em>
              Управлять освещением
              <ArrowUpRight size={16} />
            </em>
          </span>
        </button>
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
