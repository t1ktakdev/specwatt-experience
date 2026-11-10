import { useState } from "react";
import {
  ArrowUpRight,
  SlidersHorizontal,
  Zap,
  Radio,
  WifiOff,
  Clock3,
  CircleHelp,
  Activity,
  LoaderCircle,
  TriangleAlert,
  Cpu,
  ShieldCheck,
  Database,
} from "lucide-react";
import { LinkState } from "../model";
import { useApp } from "../state/context";
import {
  Icon,
  Brand,
  Header,
  DemoBadge,
  SectionTitle,
  Toggle,
  Nav,
  DetailRow,
} from "../components/ui";

export function Settings() {
  const { link, setLink, go, toast } = useApp();
  const [motion, setMotion] = useState(
    () => localStorage.getItem("specwatt-reduce-motion") === "true",
  );
  const [about, setAbout] = useState(false);
  return (
    <>
      <main className="screen-content settings-content">
        <Header
          title="Настройки"
          subtitle="Соединение, интерфейс и локальные данные"
          back
          action="none"
        />
        <div className="settings-profile material">
          <span className="profile-monogram">
            <Zap size={26} />
          </span>
          <div>
            <h2>Мой SpecWATT</h2>
            <span>Локальный демонстрационный стенд</span>
          </div>
          <DemoBadge compact />
        </div>
        <SectionTitle>Соединение</SectionTitle>
        <div className="connection-panel material">
          <div>
            <span className={`connection-visual ${link}`}>
              <Icon
                icon={
                  link === "online"
                    ? Radio
                    : link === "loading"
                      ? LoaderCircle
                      : link === "error"
                        ? TriangleAlert
                        : WifiOff
                }
                size={25}
              />
            </span>
            <span>
              <strong>
                {link === "online"
                  ? "Демо-сессия активна"
                  : link === "offline"
                    ? "Контроллер недоступен"
                    : link === "loading"
                      ? "Обновление состояния"
                      : "Ошибка соединения"}
              </strong>
              <small>
                {link === "online"
                  ? "Источник: локальный симулятор"
                  : "Демонстрация состояния интерфейса"}
              </small>
            </span>
          </div>
          <label className="form-label">
            Состояние для просмотра
            <select
              aria-label="Состояние соединения"
              value={link}
              onChange={(e) => {
                setLink(e.target.value as LinkState);
                toast("Состояние демо-соединения изменено");
              }}
            >
              <option value="online">Подключено · демо</option>
              <option value="offline">Offline · нет связи</option>
              <option value="loading">Loading · обновление</option>
              <option value="error">Error · ошибка</option>
            </select>
          </label>
          <button className="text-link" onClick={() => go("home")}>
            Посмотреть на главной
            <ArrowUpRight size={15} />
          </button>
        </div>
        <SectionTitle>Приложение</SectionTitle>
        <div className="list-surface">
          <DetailRow
            icon={SlidersHorizontal}
            title="Язык интерфейса"
            detail="Русский"
          />
          <div className="detail-row">
            <span className="detail-icon">
              <Activity size={21} />
            </span>
            <span className="detail-row-copy">
              <strong>Меньше движения</strong>
              <small>Мягкий режим переходов</small>
            </span>
            <Toggle
              checked={motion}
              onChange={() => {
                setMotion(!motion);
                document.documentElement.classList.toggle(
                  "reduce-motion",
                  !motion,
                );
                localStorage.setItem("specwatt-reduce-motion", String(!motion));
              }}
              label="Меньше движения"
            />
          </div>
          <DetailRow
            icon={Cpu}
            title="Подключение ESP32"
            detail="Процесс первичной настройки"
            onClick={() => go("setup")}
          />
          <DetailRow
            icon={Clock3}
            title="Журнал событий"
            detail="История текущей демо-сессии"
            onClick={() => go("journal")}
          />
          <DetailRow
            icon={CircleHelp}
            title="О прототипе"
            detail="Возможности и допущения"
            onClick={() => setAbout(!about)}
          />
        </div>
        <SectionTitle>Безопасность и данные</SectionTitle>
        <div className="list-surface">
          <DetailRow
            icon={ShieldCheck}
            title="Защита CH3"
            detail="Всегда исключён из управления"
            onClick={() => go("protected")}
          />
          <DetailRow
            icon={Zap}
            title="Лимит нагрузки"
            detail="Проверяется перед переключением"
            value="7 Вт"
          />
          <DetailRow
            icon={Database}
            title="Только на этом устройстве"
            detail="Расписания и разрешения хранятся в браузере"
          />
        </div>
        <section className="settings-safety">
          <div>
            <ShieldCheck size={20} />
            <strong>Вы в демонстрационном режиме</strong>
          </div>
          <p>
            Телеметрия ESP32 не подключена. Переключатели меняют локальную
            модель; расписания не выполняются по времени.
          </p>
        </section>
        {about && (
          <div className="about-panel">
            <h3>Красивый интерфейс. Честные границы.</h3>
            <p>
              Все данные демонстрационные. Диммер — визуальная концепция.
              Автопилот и расписания не выполняют фоновые команды. Реальная
              телеметрия, ESP32 и тарифы не подключены.
            </p>
          </div>
        )}
        <div className="settings-foot">
          <Brand small />
          <span>EXPERIENCE V4 · WEB DEMO</span>
        </div>
      </main>
      <Nav active="home" />
    </>
  );
}
