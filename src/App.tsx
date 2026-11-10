import { useEffect, useRef, useState, ReactNode } from "react";
import { ShieldCheck, Check, X, Layers } from "lucide-react";
import {
  readChannels,
  requestSwitch,
  totalWatts,
  ChannelId,
  ChannelState,
  LinkState,
} from "./model";
import { Page, LogEntry, Model } from "./types";
import { Context } from "./state/context";
import { useDialogFocus } from "./hooks/useDialogFocus";
import { pageLabels } from "./lib/design";
import { StatusBar, Primary, HomeIndicator } from "./components/ui";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { Welcome } from "./screens/Welcome";
import { Home } from "./screens/Home";
import { Lighting } from "./screens/Lighting";
import { Energy } from "./screens/Energy";
import { Devices } from "./screens/Devices";
import { DeviceDetail } from "./screens/DeviceDetail";
import { Protected } from "./screens/Protected";
import { Autopilot } from "./screens/Autopilot";
import { Planner } from "./screens/Planner";
import { Journal } from "./screens/Journal";
import { Setup } from "./screens/Setup";
import { Settings } from "./screens/Settings";

export function Screen({ page }: { page: Page }) {
  const screens: Record<Page, ReactNode> = {
    welcome: <Welcome />,
    home: <Home />,
    lighting: <Lighting />,
    energy: <Energy />,
    devices: <Devices />,
    device: <DeviceDetail />,
    autopilot: <Autopilot />,
    planner: <Planner />,
    journal: <Journal />,
    setup: <Setup />,
    settings: <Settings />,
    protected: <Protected />,
  };
  return (
    <div className={`phone-screen page-${page}`}>
      <StatusBar />
      {screens[page]}
      <HomeIndicator />
    </div>
  );
}

export function readPage(): Page {
  const p = location.hash.slice(1);
  return Object.hasOwn(pageLabels, p) ? (p as Page) : "welcome";
}

export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const [channels, setChannels] = useState<ChannelState>(() => {
    return readChannels(localStorage.getItem("specwatt-channels"));
  });
  const [link, setLink] = useState<LinkState>("online");
  const [brightness, setBrightness] = useState(70);
  const [auto, setAuto] = useState(false);
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState("");
  const [gallery, setGallery] = useState(
    new URLSearchParams(location.search).has("gallery"),
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [events, setEvents] = useState<LogEntry[]>(() => [
    {
      title: "Защита активна",
      detail: "CH3 исключён из управления",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      kind: "shield",
    },
    {
      title: "Демо-сессия начата",
      detail: "Локальные данные · без оборудования",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      kind: "system",
    },
  ]);
  const allGallery =
    new URLSearchParams(location.search).get("gallery") === "all";
  useDialogFocus(Boolean(dialog), ".modal", () => setDialog(""));
  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      localStorage.getItem("specwatt-reduce-motion") === "true",
    );
    const fn = () => setPage(readPage());
    addEventListener("hashchange", fn);
    return () => removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    localStorage.setItem("specwatt-channels", JSON.stringify(channels));
  }, [channels]);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );
  function go(p: Page) {
    location.hash = p;
    setPage(p);
  }
  function toast(s: string) {
    setNotice(s);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotice(""), 4200);
  }
  function toggle(id: ChannelId) {
    const result = requestSwitch(channels, id, link);
    if (!result.ok) {
      if (result.reason === "limit") {
        setDialog("limit");
        record({
          title: "Лимит сохранил баланс",
          detail: "Запрос 8,4 Вт отклонён · лимит 7 Вт · состояние не изменено",
          kind: "warning",
          channel: id,
        });
      } else if (result.reason === "protected") go("protected");
      else toast("Нет актуального соединения. Команда не отправлена.");
      return;
    }
    setChannels(result.next);
    record({
      title: `${id === "CH1" ? "Светильник" : "LED-лента"} ${result.next[id] ? "включён" : "выключен"}`,
      detail: "Локальная симуляция · не команда оборудованию",
      kind: "light",
      channel: id,
    });
    toast("Состояние изменено в демо");
  }
  function record(entry: Omit<LogEntry, "time">) {
    setEvents((items) =>
      [
        {
          ...entry,
          time: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...items,
      ].slice(0, 100),
    );
  }
  const model: Model = {
    page,
    go,
    channels,
    toggle,
    link,
    setLink: (next) => {
      setLink(next);
      if (next !== "online") setAuto(false);
      record({
        title:
          next === "online"
            ? "Демо-сессия доступна"
            : next === "offline"
              ? "Демонстрация отсутствия связи"
              : next === "loading"
                ? "Ожидание демо-состояния"
                : "Ошибка демо-соединения",
        detail: "Состояние интерфейса · сетевые команды не отправлены",
        kind: "system",
      });
    },
    brightness,
    setBrightness,
    auto,
    setAuto,
    events,
    record,
    toast,
    modal: setDialog,
  };
  return (
    <Context.Provider value={model}>
      <div
        data-version="3"
        className={`experience ${gallery ? "is-gallery" : ""}`}
      >
        {!gallery && <DesktopSidebar page={page} go={go} />}
        <div className="stage">
          <div className="stage-toolbar">
            <span>SPECWATT / PRODUCT EXPERIENCE</span>
            <button onClick={() => setGallery((v) => !v)}>
              <Layers size={15} />
              {gallery ? "Интерактивный режим" : "Обзор экранов"}
            </button>
          </div>
          {gallery ? (
            <div className="gallery">
              {(allGallery
                ? (Object.keys(pageLabels) as Page[])
                : (["welcome", "home", "lighting", "energy"] as Page[])
              ).map((p, i) => (
                <div className="gallery-item" key={p}>
                  <span className="gallery-title">
                    0{i + 1} / {pageLabels[p]}
                  </span>
                  <div className="phone-frame">
                    <Screen page={p} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="phone-frame">
              <Screen page={page} />
            </div>
          )}
          <div className="stage-caption">
            <span>DESIGNED TO FEEL DIFFERENT.</span>
            <span>EXPERIENCE V3 · MOBILE WEB · RU</span>
          </div>
        </div>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
          <button
            aria-label="Закрыть уведомление"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {dialog && (
        <div className="modal-backdrop" onClick={() => setDialog("")}>
          <section
            className="modal material"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="dialog-icon">
              <ShieldCheck size={32} />
            </span>
            <h2 id="dialog-title">Лимит защищает ваш стенд</h2>
            <p>
              Включение обоих каналов создаст нагрузку <b>8,4 Вт</b> при лимите{" "}
              <b>7 Вт</b>. Сначала выключите другой управляемый канал.
            </p>
            <p className="muted">
              CH3 остаётся защищённым. Изменение не применено.
            </p>
            <Primary onClick={() => setDialog("")} icon={Check}>
              Понятно
            </Primary>
          </section>
        </div>
      )}
    </Context.Provider>
  );
}
