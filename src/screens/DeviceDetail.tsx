import { Power, Sparkles, Clock3, CalendarDays, History } from "lucide-react";
import { useApp } from "../state/context";
import { ProductVisual } from "../components/ProductVisual";
import {
  Header,
  SectionTitle,
  Toggle,
  Nav,
  DetailRow,
  ConnectionBanner,
} from "../components/ui";

export function LampIllustration({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 300 220"
      className={`lamp-illustration ${on ? "lit" : ""}`}
      role="img"
      aria-label="Дисковый подвесной светильник, концептуальная иллюстрация CH1"
    >
      <defs>
        <linearGradient id="pendant-metal" x1="0" x2="1">
          <stop stopColor="#342e27" />
          <stop offset=".25" stopColor="#8c7252" />
          <stop offset=".48" stopColor="#b89b71" />
          <stop offset=".7" stopColor="#6a563e" />
          <stop offset="1" stopColor="#262824" />
        </linearGradient>
        <linearGradient id="pendant-face" x2="0" y2="1">
          <stop stopColor={on ? "#fff0ce" : "#787a6d"} />
          <stop offset="1" stopColor={on ? "#d6a15c" : "#373e36"} />
        </linearGradient>
        <radialGradient id="pendant-wash">
          <stop stopColor="#f2bc81" stopOpacity={on ? ".32" : "0"} />
          <stop offset="1" stopColor="#edb17c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="185" rx="130" ry="27" fill="url(#pendant-wash)" />
      <path d="M149 0V80" stroke="#77776b" strokeWidth="1.5" />
      <path d="M144 76h12v12h-12Z" fill="#71634d" />
      <path
        d="M52 114C64 92 102 81 150 81S236 92 248 114L245 123H55Z"
        fill="url(#pendant-metal)"
        stroke="#ad936b"
        strokeWidth=".6"
      />
      <ellipse
        cx="150"
        cy="121"
        rx="96"
        ry="22"
        fill="#151a18"
        stroke="#a28964"
        strokeWidth="1"
      />
      <ellipse cx="150" cy="123" rx="87" ry="16" fill="url(#pendant-face)" />
      <path
        d="M65 113C110 98 190 98 235 113"
        fill="none"
        stroke="#f4d2a1"
        strokeOpacity=".24"
      />
      <path
        d="M69 128Q150 147 231 128"
        fill="none"
        stroke={on ? "#ffe9b7" : "#686e5e"}
        strokeWidth="1"
      />
    </svg>
  );
}

export function DeviceDetail() {
  const { channels, toggle, link, go, events } = useApp();
  const last = events.find((e) => e.channel === "CH1");
  return (
    <>
      <main className="screen-content">
        <Header title="Основной свет" subtitle="Светильник · CH1" back />
        <ConnectionBanner />
        <div className="device-object material">
          <span className="object-category">LIGHT / 01 · КОНЦЕПЦИЯ</span>
          <ProductVisual id="CH1" on={channels.CH1} known={link === "online"} />
          <span className={`object-status ${channels.CH1 ? "lit" : ""}`}>
            <i />
            {link !== "online"
              ? "НЕТ ПОДТВЕРЖДЕНИЯ"
              : channels.CH1
                ? "ВКЛЮЧЕНО"
                : "ВЫКЛЮЧЕНО"}
          </span>
        </div>
        <div className="light-power-row material">
          <div className={`power-symbol ${channels.CH1 ? "lit" : ""}`}>
            <Power size={26} />
          </div>
          <div>
            <strong>Питание светильника</strong>
            <span>
              {link === "online"
                ? channels.CH1
                  ? "1,8 Вт · демо"
                  : "0 Вт · демо"
                : "Нет актуальных данных"}
            </span>
          </div>
          <Toggle
            label="Светильник: питание"
            checked={channels.CH1}
            onChange={() => toggle("CH1")}
            disabled={link !== "online"}
          />
        </div>
        <div className="device-stats">
          <div>
            <span>НОМИНАЛЬНАЯ МОЩНОСТЬ</span>
            <b>
              1,8 <small>Вт</small>
            </b>
          </div>
          <div>
            <span>КАНАЛ</span>
            <b>
              CH1 <small>управляемый</small>
            </b>
          </div>
        </div>
        <SectionTitle>Параметры управления</SectionTitle>
        <div className="list-surface">
          <DetailRow
            icon={Clock3}
            title="Ручной приоритет"
            detail="Автопилот не отправляет фоновые команды"
            value="Демо"
          />
          <DetailRow
            icon={Sparkles}
            title="Правила автоматизации"
            detail="Только с вашим разрешением"
            onClick={() => go("autopilot")}
          />
          <DetailRow
            icon={CalendarDays}
            title="Расписание"
            detail="Настроить демо-план"
            onClick={() => go("planner")}
          />
        </div>
        <SectionTitle action="Журнал" onClick={() => go("journal")}>
          История канала
        </SectionTitle>
        <div className="device-history">
          <span>
            <History size={12} /> ТЕКУЩАЯ СЕССИЯ
          </span>
          <p>{last ? last.title : "Ручных действий пока нет"}</p>
          <small>
            {last
              ? `${last.time} · ${last.detail}`
              : "Переключение появится здесь после действия в демо."}
          </small>
        </div>
        <p className="fine-note">
          Только включение и выключение. Аппаратное диммирование светильника не
          подтверждено.
        </p>
      </main>
      <Nav active="devices" />
    </>
  );
}
