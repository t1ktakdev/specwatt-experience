import { useEffect, useRef, useState, ReactNode } from "react";
import { ShieldCheck, Check, X, Layers } from "lucide-react";
import {
  initialChannels,
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
  return p in pageLabels ? (p as Page) : "welcome";
}

export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const [channels, setChannels] = useState<ChannelState>(() => {
    try {
      const v = JSON.parse(localStorage.getItem("specwatt-channels") || "null");
      return v &&
        typeof v.CH1 === "boolean" &&
        typeof v.CH2 === "boolean" &&
        v.CH3 === true &&
        totalWatts(v) <= 7
        ? v
        : initialChannels;
    } catch {
      return initialChannels;
    }
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
  const [events, setEvents] = useState<LogEntry[]>([
    {
      title: "Свет для тихого вечера",
      detail: "CH2 включён в демонстрации",
      time: "19:24",
      kind: "light",
    },
    {
      title: "Защита активна",
      detail: "CH3 исключён из управления",
      time: "19:20",
      kind: "shield",
    },
    {
      title: "Демо-сессия начата",
      detail: "Локальные данные · без оборудования",
      time: "19:20",
      kind: "system",
    },
  ]);
  useDialogFocus(Boolean(dialog), ".modal", () => setDialog(""));
  useEffect(() => {
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
      if (result.reason === "limit") setDialog("limit");
      else if (result.reason === "protected") go("protected");
      else toast("Нет актуального соединения. Команда не отправлена.");
      return;
    }
    setChannels(result.next);
    setEvents((e) => [
      {
        title: `${id === "CH1" ? "Светильник" : "LED-лента"} ${result.next[id] ? "включён" : "выключен"}`,
        detail: "Локальная симуляция · не команда оборудованию",
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        kind: "light",
      },
      ...e,
    ]);
    toast("Состояние изменено в демо");
  }
  const model: Model = {
    page,
    go,
    channels,
    toggle,
    link,
    setLink,
    brightness,
    setBrightness,
    auto,
    setAuto,
    events,
    toast,
    modal: setDialog,
  };
  return (
    <Context.Provider value={model}>
      <div className={`experience ${gallery ? "is-gallery" : ""}`}>
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
              {(["welcome", "home", "lighting", "energy"] as Page[]).map(
                (p, i) => (
                  <div className="gallery-item" key={p}>
                    <span className="gallery-title">
                      0{i + 1} / {pageLabels[p]}
                    </span>
                    <div className="phone-frame">
                      <Screen page={p} />
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="phone-frame">
              <Screen page={page} />
            </div>
          )}
          <div className="stage-caption">
            <span>DESIGNED TO FEEL DIFFERENT.</span>
            <span>ANDROID EXPERIENCE · RU</span>
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
