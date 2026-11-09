import { ReactNode } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Zap,
  LayoutGrid,
  House,
  ChartNoAxesCombined,
  Sparkles,
  Settings2,
  Wifi,
  WifiOff,
  Bell,
  LoaderCircle,
  TriangleAlert,
  LucideIcon,
} from "lucide-react";
import { ChannelId } from "../model";
import { Page } from "../types";
import { useApp } from "../state/context";

export function Icon({
  icon: I,
  size = 22,
  ...props
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  return <I size={size} strokeWidth={1.65} {...props} />;
}

export function IconButton({
  icon,
  label,
  onClick,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`icon-button ${className}`}
      aria-label={label}
      onClick={onClick}
    >
      <Icon icon={icon} />
    </button>
  );
}

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "small" : ""}`}>
      <span className="brand-symbol">
        <Zap size={small ? 16 : 20} fill="currentColor" strokeWidth={0} />
      </span>
      spec<span className="brand-watt">watt</span>
      <i />
    </span>
  );
}

export function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div>
        <svg width="15" height="13" viewBox="0 0 15 13" aria-hidden="true">
          <path
            d="M1 11V9M5 11V6M9 11V3M13 11V1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <Wifi size={15} strokeWidth={2} />
        <svg width="24" height="13" viewBox="0 0 24 13" aria-hidden="true">
          <rect
            x="1"
            y="2"
            width="19"
            height="9"
            rx="2"
            fill="none"
            stroke="currentColor"
          />
          <rect x="3" y="4" width="15" height="5" rx="1" fill="currentColor" />
          <path d="M22 5v3" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export function Header({
  title,
  subtitle,
  action = "settings",
  back = false,
}: {
  title: string;
  subtitle?: string;
  action?: "settings" | "journal" | "none";
  back?: boolean;
}) {
  const { go } = useApp();
  return (
    <header className={`page-header ${back ? "with-back" : ""}`}>
      <div>
        {back ? (
          <button className="back-label" onClick={() => go("home")}>
            <Icon icon={ArrowLeft} size={20} />
            <span>Обзор</span>
          </button>
        ) : (
          <span className="eyebrow">
            SPECWATT <span className="eyebrow-dot" /> МОЙ СТЕНД
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action !== "none" && (
        <IconButton
          icon={action === "journal" ? Bell : Settings2}
          label={action === "journal" ? "Журнал событий" : "Настройки"}
          onClick={() => go(action === "journal" ? "journal" : "settings")}
        />
      )}
    </header>
  );
}

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="demo-badge">
      <i />
      {compact ? "ДЕМО" : "ДЕМО-ДАННЫЕ"}
    </span>
  );
}

export function SectionTitle({
  children,
  action,
  onClick,
}: {
  children: ReactNode;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {action && (
        <button onClick={onClick}>
          {action}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

export function Primary({
  children,
  onClick,
  icon = ArrowRight,
  secondary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: LucideIcon;
  secondary?: boolean;
}) {
  return (
    <button
      className={`primary-button ${secondary ? "secondary" : ""}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <Icon icon={icon} size={21} />
    </button>
  );
}

export function Nav({ active }: { active: Page }) {
  const { go } = useApp();
  const tabs: { id: Page; label: string; icon: LucideIcon }[] = [
    { id: "home", label: "Главная", icon: House },
    { id: "devices", label: "Устройства", icon: LayoutGrid },
    { id: "energy", label: "Энергия", icon: ChartNoAxesCombined },
    { id: "autopilot", label: "Авто", icon: Sparkles },
  ];
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={t.id === active ? "active" : ""}
          aria-current={t.id === active ? "page" : undefined}
          onClick={() => go(t.id)}
        >
          <Icon icon={t.icon} size={22} />
          <span>{t.label}</span>
          {t.id === active && <i />}
        </button>
      ))}
    </nav>
  );
}

export function HomeIndicator() {
  return <div className="home-indicator" />;
}

export function DetailRow({
  icon,
  title,
  detail,
  value,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  detail?: string;
  value?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="detail-icon">
        <Icon icon={icon} size={21} />
      </span>
      <span className="detail-row-copy">
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
      {value && <span className="detail-value">{value}</span>}
      {onClick && <ChevronRight size={16} />}
    </>
  );
  return onClick ? (
    <button className="detail-row" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="detail-row">{content}</div>
  );
}

export function SystemState() {
  const { link, go } = useApp();
  return (
    <button className={`system-state ${link}`} onClick={() => go("settings")}>
      <span className="connection-dot" />
      <span>
        {link === "online"
          ? "Симулятор подключён"
          : link === "loading"
            ? "Обновляем состояние…"
            : link === "offline"
              ? "Нет соединения"
              : "Ошибка соединения"}
      </span>
      <span className="system-source">
        {link === "online" ? "Только демо" : "Проверить"}
        <ChevronRight size={14} />
      </span>
    </button>
  );
}

export function ConnectionBanner() {
  const { link, setLink } = useApp();
  if (link === "online") return null;
  return (
    <div className="connection-banner">
      <div>
        <Icon
          icon={
            link === "loading"
              ? LoaderCircle
              : link === "error"
                ? TriangleAlert
                : WifiOff
          }
          size={19}
          className={link === "loading" ? "spin" : ""}
        />
        <b>
          {link === "loading"
            ? "Получаем состояние…"
            : link === "error"
              ? "Не удалось обновить данные"
              : "Соединение прервано"}
        </b>
      </div>
      <p>
        {link === "loading"
          ? "Демонстрация ожидания. Управление временно недоступно."
          : "Актуальная мощность неизвестна. Каналы недоступны для переключения; CH3 остаётся защищённым."}
      </p>
      <button onClick={() => setLink("online")}>
        Вернуться к подключённому демо
      </button>
    </div>
  );
}

export function DeviceCard({
  id,
  title,
  detail,
  icon,
}: {
  id: ChannelId;
  title: string;
  detail: string;
  icon: LucideIcon;
}) {
  const { channels, toggle, go, link } = useApp();
  const on = channels[id];
  return (
    <article className={`device-card ${on ? "is-on" : ""}`}>
      <div className="device-card-top">
        <button
          className="device-icon"
          onClick={() => go(id === "CH2" ? "lighting" : "device")}
          aria-label={`Открыть ${title}`}
        >
          <Icon icon={icon} size={29} />
        </button>
        <span className="channel-label">{id}</span>
      </div>
      <button
        className="device-card-title"
        onClick={() => go(id === "CH2" ? "lighting" : "device")}
      >
        <h3>{title}</h3>
        <span>{detail}</span>
      </button>
      <div className="device-card-bottom">
        <span>
          {link === "online" ? (on ? "Включено" : "Выключено") : "Нет связи"}
        </span>
        <Toggle
          checked={on}
          onChange={() => toggle(id)}
          label={`${title}: питание`}
          disabled={link !== "online"}
        />
      </div>
    </article>
  );
}
