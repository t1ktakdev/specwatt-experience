import { useEffect, useRef, useState, ReactNode } from "react";
import { Check, X, Layers } from "lucide-react";
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
import { StatusBar, HomeIndicator } from "./components/ui";
import { LimitDialog } from "./components/LimitDialog";
import { StateGallery } from "./components/StateGallery";
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
import type { PlannerPreview } from "./screens/Planner";
import type { Period } from "./lib/demo-energy";

export function Screen({
  page,
  setupStep,
  energyPeriod,
  plannerPreview,
  allowPreview,
}: {
  page: Page;
  setupStep?: number;
  energyPeriod?: Period;
  plannerPreview?: PlannerPreview;
  allowPreview?: boolean;
}) {
  const screens: Record<Page, ReactNode> = {
    welcome: <Welcome />,
    home: <Home />,
    lighting: <Lighting />,
    energy: <Energy initialPeriod={energyPeriod} />,
    devices: <Devices />,
    device: <DeviceDetail />,
    autopilot: (
      <Autopilot
        initialAllow={allowPreview ? { CH1: false, CH2: true } : undefined}
      />
    ),
    planner: <Planner preview={plannerPreview} />,
    journal: <Journal />,
    setup: (
      <Setup
        initialStep={
          setupStep ||
          Math.max(
            1,
            Math.min(
              3,
              Number(new URLSearchParams(location.search).get("setupStep")) ||
                1,
            ),
          )
        }
      />
    ),
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
  const hash = location.hash.slice(1);
  const p = Object.hasOwn(pageLabels, hash)
    ? hash
    : new URLSearchParams(location.search).get("screen") || "welcome";
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
        data-version="4"
        className={`experience ${gallery ? "is-gallery" : ""} ${new URLSearchParams(location.search).has("designexport") ? "design-export" : ""}`}
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
              {new URLSearchParams(location.search).get("gallery") ===
              "workflows" ? (
                <>
                  {(["День", "Месяц"] as Period[]).map((period) => (
                    <div
                      className="gallery-item"
                      key={period}
                      data-route={`energy-${period}`}
                    >
                      <span className="gallery-title">
                        Аналитика / {period}
                      </span>
                      <div className="phone-frame">
                        <Screen page="energy" energyPeriod={period} />
                      </div>
                    </div>
                  ))}
                  {(["saved", "editing", "conflict"] as PlannerPreview[]).map(
                    (preview) => (
                      <div
                        className="gallery-item"
                        key={preview}
                        data-route={`planner-${preview}`}
                      >
                        <span className="gallery-title">
                          Пример демо-плана / {preview}
                        </span>
                        <div className="phone-frame">
                          <Screen page="planner" plannerPreview={preview} />
                        </div>
                      </div>
                    ),
                  )}
                  <div className="gallery-item" data-route="permission-granted">
                    <span className="gallery-title">
                      Разрешение CH2 / явное согласие
                    </span>
                    <div className="phone-frame">
                      <Context.Provider value={{ ...model, auto: true }}>
                        <Screen page="autopilot" allowPreview />
                      </Context.Provider>
                    </div>
                  </div>
                </>
              ) : new URLSearchParams(location.search).get("gallery") ===
                "states" ? (
                <StateGallery
                  model={model}
                  renderScreen={(page) => <Screen page={page} />}
                />
              ) : (
                (allGallery
                  ? (Object.keys(pageLabels) as Page[])
                  : (["welcome", "home", "lighting", "energy"] as Page[])
                ).map((p, i) => (
                  <div className="gallery-item" key={p} data-route={p}>
                    <span className="gallery-title">
                      0{i + 1} / {pageLabels[p]}
                    </span>
                    <div className="phone-frame">
                      <Screen page={p} />
                    </div>
                  </div>
                ))
              )}
              {allGallery &&
                new URLSearchParams(location.search).has("designexport") &&
                [2, 3].map((step) => (
                  <div
                    className="gallery-item"
                    key={step}
                    data-route={`setup-${step}`}
                  >
                    <span className="gallery-title">
                      Подключение / шаг {step}
                    </span>
                    <div className="phone-frame">
                      <Screen page="setup" setupStep={step} />
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
            <span>EXPERIENCE V4 · MOBILE WEB · RU</span>
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
          <LimitDialog onClose={() => setDialog("")} />
        </div>
      )}
    </Context.Provider>
  );
}
