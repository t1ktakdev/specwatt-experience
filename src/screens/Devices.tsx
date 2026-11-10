import { useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Sun,
  Lightbulb,
  ShieldCheck,
  Radio,
  Plus,
  Cpu,
} from "lucide-react";
import { useApp } from "../state/context";
import {
  Header,
  SectionTitle,
  Nav,
  SystemState,
  DeviceCard,
  ConnectionBanner,
} from "../components/ui";

export function Devices() {
  const { go, channels, link } = useApp();
  const [filter, setFilter] = useState("Все");
  return (
    <>
      <main className="screen-content">
        <Header
          title="Ваши устройства"
          subtitle="Один стенд. Всё на своих местах."
        />
        <SystemState />
        <ConnectionBanner />
        <div className="devices-summary">
          <div className="device-count">
            03<span>КАНАЛА В СИСТЕМЕ</span>
            <div className="catalog-meta">
              <span>
                <b>02</b> управляемых
              </span>
              <span>
                <b>01</b> защищённый
              </span>
            </div>
          </div>
          <div className="summary-orbit">
            <Cpu size={27} />
            <span />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="filter-chips">
          {["Все", "Включены", "Защищённые"].map((f) => (
            <button
              key={f}
              className={f === filter ? "active" : ""}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <SectionTitle>
          Учебный стенд <span className="section-count">01</span>
        </SectionTitle>
        {filter !== "Защищённые" && (
          <div className="device-grid">
            {(filter === "Все" || channels.CH1) && (
              <DeviceCard
                id="CH1"
                title="Светильник"
                detail="Основной свет"
                icon={Lightbulb}
              />
            )}
            {(filter === "Все" || channels.CH2) && (
              <DeviceCard
                id="CH2"
                title="LED-лента"
                detail="Атмосферный свет"
                icon={Sun}
              />
            )}
          </div>
        )}
        <button
          className="protected-card material"
          onClick={() => go("protected")}
        >
          <span className="protected-visual">
            <ShieldCheck size={31} />
          </span>
          <span>
            <small>CH3 · ЗАЩИЩЁННЫЙ</small>
            <strong>Важное — под защитой.</strong>
            <em>
              {link === "online"
                ? "2,4 Вт · управление заблокировано"
                : "Последнее известное: 2,4 Вт"}
            </em>
          </span>
          <ChevronRight size={18} />
        </button>
        <div className="device-meta">
          <Radio size={17} />
          <span>Симулятор · данные локальной демо-сессии</span>
        </div>
        <button className="add-controller" onClick={() => go("setup")}>
          <Plus size={23} />
          <span>
            Подключение контроллера<small>Посмотреть процесс настройки</small>
          </span>
          <ArrowUpRight size={18} />
        </button>
      </main>
      <Nav active="devices" />
    </>
  );
}
