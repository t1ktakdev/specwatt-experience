import { useState } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Plus,
  Check,
  Clock3,
  X,
} from "lucide-react";
import { useApp } from "../state/context";
import { useDialogFocus } from "../hooks/useDialogFocus";
import {
  IconButton,
  Header,
  DemoBadge,
  SectionTitle,
  Toggle,
  Primary,
  Nav,
} from "../components/ui";

export type Schedule = {
  id: number;
  channel: "CH1" | "CH2";
  time: string;
  end: string;
  name: string;
  enabled: boolean;
  days: string[];
};

export function Planner() {
  const { go, toast } = useApp();
  const [plans, setPlans] = useState<Schedule[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("specwatt-plans") || "[]");
    } catch {
      return [];
    }
  });
  const [editing, setEditing] = useState(false);
  const [channel, setChannel] = useState<"CH1" | "CH2">("CH2");
  const [time, setTime] = useState("19:00");
  const [end, setEnd] = useState("22:30");
  const [days, setDays] = useState(["Пн", "Вт", "Ср", "Чт", "Пт"]);
  const [selectedDay, setSelectedDay] = useState("Вт");
  const [validation, setValidation] = useState("");
  useDialogFocus(editing, ".bottom-sheet", () => setEditing(false));
  function persist(next: Schedule[]) {
    setPlans(next);
    localStorage.setItem("specwatt-plans", JSON.stringify(next));
  }
  function save() {
    if (!days.length) {
      setValidation("Выберите хотя бы один день");
      return;
    }
    if (time >= end) {
      setValidation("Окончание должно быть позже начала в тот же день");
      return;
    }
    persist([
      ...plans,
      {
        id: Date.now(),
        channel,
        time,
        end,
        name: channel === "CH2" ? "Вечерний свет" : "Основной свет",
        enabled: true,
        days,
      },
    ]);
    setEditing(false);
    setValidation("");
    toast("Расписание сохранено в демо. Выполнение не подключено.");
  }
  return (
    <>
      <main className="screen-content planner-content">
        <Header title="У каждого света — своё время." back action="none" />
        <div className="planner-week">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d, i) => (
            <button
              className={selectedDay === d ? "selected" : ""}
              key={d}
              onClick={() => setSelectedDay(d)}
            >
              <span>{d}</span>
              <b>{9 + i}</b>
              {plans.some((p) => p.days.includes(d)) && <i />}
            </button>
          ))}
        </div>
        <div className="load-preview material">
          <div>
            <span className="eyebrow">ПЛАН НА ДЕНЬ</span>
            <DemoBadge compact />
          </div>
          <h2>Нагрузка без спешки.</h2>
          <div className="timeline-preview">
            <div className="timeline-limit">7 Вт — лимит</div>
            <svg
              viewBox="0 0 300 94"
              aria-label="Иллюстрация планируемой нагрузки"
            >
              <path d="M0 15H300" stroke="#dfbd8733" strokeDasharray="4 5" />
              <path d="M0 74H300M0 45H300" stroke="#ffffff0a" />
              <path
                d="M0 74H76V57H120V74H211V27H258V74H300"
                fill="none"
                stroke="#eab179"
                strokeWidth="2"
              />
              <path
                d="M0 74H76V57H120V74H211V27H258V74H300V94H0Z"
                fill="#d9aa6e12"
              />
              <path d="M0 83H300" stroke="#a5b39855" strokeWidth="2" />
            </svg>
            <div>
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
          <p>Иллюстрация · фактический прогноз не рассчитывается</p>
        </div>
        <SectionTitle action="Добавить" onClick={() => setEditing(true)}>
          Ваши расписания
        </SectionTitle>
        {plans.length === 0 ? (
          <div className="empty-schedules">
            <span>
              <Clock3 size={29} />
            </span>
            <h3>Начните с тихого вечера.</h3>
            <p>
              Задайте время для CH1 или CH2.
              <br />
              CH3 останется вне расписаний.
            </p>
            <button onClick={() => setEditing(true)}>
              <Plus size={16} />
              Первое расписание
            </button>
          </div>
        ) : (
          <div className="schedule-list">
            {plans.filter((p) => p.days.includes(selectedDay)).length === 0 ? (
              <p className="fine-note">
                На {selectedDay} ничего не запланировано. Выберите другой день
                или добавьте расписание.
              </p>
            ) : (
              plans
                .filter((p) => p.days.includes(selectedDay))
                .map((p) => (
                  <div className="schedule-item material" key={p.id}>
                    <div className="schedule-time">
                      {p.time}
                      <span>{p.end}</span>
                    </div>
                    <div>
                      <strong>{p.name}</strong>
                      <span>
                        {p.channel} · {p.days.join(", ")}
                      </span>
                      <small>Только демо</small>
                    </div>
                    <Toggle
                      label={`Расписание ${p.name}`}
                      checked={p.enabled}
                      onChange={() =>
                        persist(
                          plans.map((v) =>
                            v.id === p.id ? { ...v, enabled: !v.enabled } : v,
                          ),
                        )
                      }
                    />
                    <button
                      className="delete-plan"
                      aria-label={`Удалить расписание ${p.name}`}
                      onClick={() => {
                        persist(plans.filter((v) => v.id !== p.id));
                        toast("Демо-расписание удалено");
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
            )}
          </div>
        )}
        <button className="protection-line" onClick={() => go("protected")}>
          <span className="shield-mini">
            <ShieldCheck size={20} />
          </span>
          <span>
            <b>Защита важнее расписания</b>
            <small>CH3 и ручной приоритет сохраняются</small>
          </span>
          <ChevronRight size={17} />
        </button>
      </main>
      <Nav active="autopilot" />
      {editing && (
        <div className="sheet-backdrop" onClick={() => setEditing(false)}>
          <section
            className="bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />
            <div className="sheet-title">
              <h2 id="schedule-title">Свой ритм света</h2>
              <IconButton
                icon={X}
                label="Закрыть расписание"
                onClick={() => setEditing(false)}
              />
            </div>
            <label className="form-label">
              Канал
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as "CH1" | "CH2")}
              >
                <option value="CH1">CH1 · Основной свет</option>
                <option value="CH2">CH2 · LED-лента</option>
              </select>
            </label>
            <div className="time-inputs">
              <label className="form-label">
                Включить в
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </label>
              <label className="form-label">
                Выключить в
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                />
              </label>
            </div>
            <span className="form-label">Повторять</span>
            <div className="day-selector">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                <button
                  aria-pressed={days.includes(d)}
                  className={days.includes(d) ? "selected" : ""}
                  key={d}
                  onClick={() =>
                    setDays((v) =>
                      v.includes(d) ? v.filter((x) => x !== d) : [...v, d],
                    )
                  }
                >
                  {d}
                </button>
              ))}
            </div>
            {validation && (
              <p className="validation-error" role="alert">
                {validation}
              </p>
            )}
            <p className="fine-note">
              Сохраняется на этом устройстве. Исполнение по времени не
              подключено.
            </p>
            <Primary onClick={save} icon={Check}>
              Сохранить демо-план
            </Primary>
          </section>
        </div>
      )}
    </>
  );
}
