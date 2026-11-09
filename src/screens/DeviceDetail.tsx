import { Power, Sparkles, Clock3, CalendarDays } from "lucide-react";
import { useApp } from "../state/context";
import { Header, SectionTitle, Toggle, Nav, DetailRow } from "../components/ui";

export function LampIllustration({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 300 220"
      className={`lamp-illustration ${on ? "lit" : ""}`}
      role="img"
      aria-label="Предметная иллюстрация светильника"
    >
      <defs>
        <linearGradient id="lampBody" x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="#59594f" />
          <stop offset=".4" stopColor="#30322e" />
          <stop offset="1" stopColor="#151918" />
        </linearGradient>
        <radialGradient id="lampLight">
          <stop stopColor="#f7daab" stopOpacity={on ? ".25" : "0"} />
          <stop offset="1" stopColor="#e5ad72" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lampFace" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={on ? "#fff0d5" : "#6b6e62"} />
          <stop offset="1" stopColor={on ? "#dcac75" : "#333a32"} />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="189" rx="117" ry="27" fill="url(#lampLight)" />
      <path d="M148 0v46" stroke="#6c6e60" strokeWidth="2" />
      <path
        d="M135 44h26l5 19h-36z"
        fill="#242a23"
        stroke="#5e6455"
        strokeWidth=".5"
      />
      <path
        d="M126 61C107 73 90 97 77 136Q150 180 223 136C208 97 191 73 172 61Z"
        fill="url(#lampBody)"
        stroke="#7e817344"
      />
      <ellipse
        cx="150"
        cy="136"
        rx="73"
        ry="23"
        fill="#1a201a"
        stroke="#777c6b66"
      />
      <ellipse cx="150" cy="138" rx="64" ry="17" fill="url(#lampFace)" />
      <path d="M103 94Q150 109 197 94" fill="none" stroke="#b3b2a518" />
      <path d="M90 119Q150 145 211 119" fill="none" stroke="#a6a79511" />
    </svg>
  );
}

export function DeviceDetail() {
  const { channels, toggle, link, go } = useApp();
  return (
    <>
      <main className="screen-content">
        <Header title="Основной свет" subtitle="Светильник · CH1" back />
        <div className="device-object material">
          <span className="object-category">LIGHT / 01</span>
          <LampIllustration on={channels.CH1} />
          <span className={`object-status ${channels.CH1 ? "lit" : ""}`}>
            <i />
            {channels.CH1 ? "ВКЛЮЧЕНО" : "ВЫКЛЮЧЕНО"}
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
            detail="Авто не мешает вашему решению"
            value="30 мин"
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
        <p className="fine-note">
          Только включение и выключение. Аппаратное диммирование светильника не
          подтверждено.
        </p>
      </main>
      <Nav active="devices" />
    </>
  );
}
