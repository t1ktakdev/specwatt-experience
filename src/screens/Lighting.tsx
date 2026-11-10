import { CSSProperties } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Sun,
  Moon,
  Power,
  Sparkles,
  MoreHorizontal,
  Clock3,
} from "lucide-react";
import { useApp } from "../state/context";
import { visuals } from "../lib/design";
import {
  Icon,
  IconButton,
  Toggle,
  Nav,
  ConnectionBanner,
} from "../components/ui";

export function Lighting() {
  const { go, channels, toggle, brightness, setBrightness, toast, link } =
    useApp();
  return (
    <>
      <main className="screen-content lighting-content">
        <div className="compact-header">
          <IconButton
            icon={ArrowLeft}
            label="Назад на главную"
            onClick={() => go("home")}
          />
          <div>
            <h1>Атмосферный свет</h1>
            <span>LED-лента · CH2</span>
          </div>
          <IconButton
            icon={MoreHorizontal}
            label="Параметры устройства"
            onClick={() => go("devices")}
          />
        </div>
        <ConnectionBanner />
        <div
          className={`lighting-scene ${!channels.CH2 ? "scene-off" : ""}`}
          style={{ "--illumination": brightness / 100 } as CSSProperties}
        >
          <img
            src={visuals.lighting}
            srcSet={`${visuals.lightingSmall} 480w, ${visuals.lighting} 960w`}
            sizes="(max-width: 760px) 100vw, 347px"
            width="960"
            height="1200"
            fetchPriority="high"
            alt="Спальня с ореховым изголовьем и скрытым архитектурным светом"
          />
          <div className="scene-shade" />
          <span className="scene-tag">
            <i />
            {link !== "online"
              ? "КОНЦЕПЦИЯ · НЕТ СВЯЗИ"
              : channels.CH2
                ? "ВЕЧЕРНИЙ СВЕТ"
                : "СВЕТ ВЫКЛЮЧЕН"}
          </span>
          <span className="scene-caption">
            Оставьте день
            <br />
            за порогом.
          </span>
          <span className="scene-count">
            BEDROOM <span>/ CONCEPT</span>
          </span>
        </div>
        <div className="light-power-row material">
          <div className={`power-symbol ${channels.CH2 ? "lit" : ""}`}>
            <Power size={26} />
          </div>
          <div>
            <strong>Питание</strong>
            <span>
              {link === "online"
                ? channels.CH2
                  ? "Включено · 4,2 Вт"
                  : "Выключено · 0 Вт"
                : "Состояние не подтверждено"}
            </span>
          </div>
          <Toggle
            checked={channels.CH2}
            onChange={() => toggle("CH2")}
            label="LED-лента: питание"
            disabled={link !== "online"}
          />
        </div>
        <div className="brightness-block">
          <div className="brightness-heading">
            <h2>
              Световая сцена <small>КОНЦЕПЦИЯ</small>
            </h2>
            <span>
              {brightness}
              <small>%</small>
            </span>
          </div>
          <div className="brightness-slider">
            <Sun size={17} />
            <input
              aria-label="Яркость концептуальной сцены"
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(+e.target.value)}
              style={
                {
                  "--range": `${((brightness - 10) / 90) * 100}%`,
                } as CSSProperties
              }
            />
            <Sun size={25} />
          </div>
          <div className="scene-presets">
            {[
              { name: "Тихий вечер", value: 35, icon: Moon },
              { name: "Мой свет", value: 70, icon: Sun },
              { name: "Яркий акцент", value: 100, icon: Sparkles },
            ].map((p) => (
              <button
                className={brightness === p.value ? "selected" : ""}
                aria-pressed={brightness === p.value}
                key={p.name}
                onClick={() => setBrightness(p.value)}
              >
                <Icon icon={p.icon} size={20} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
          <p className="concept-note">
            Концепция сцены · диммирование оборудования не подтверждено
          </p>
        </div>
        <button
          className="schedule-link"
          onClick={() => {
            go("planner");
            toast("Расписание сохраняется только в демо");
          }}
        >
          <Clock3 size={21} />
          <div>
            <b>Добавить расписание</b>
            <span>Пусть свет следует вашему ритму</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </main>
      <Nav active="devices" />
    </>
  );
}
