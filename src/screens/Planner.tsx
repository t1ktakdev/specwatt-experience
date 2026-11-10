import { useState } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Plus,
  Check,
  Clock3,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { useApp } from "../state/context";
import { useDialogFocus } from "../hooks/useDialogFocus";
import {
  Header,
  DemoBadge,
  SectionTitle,
  Toggle,
  Primary,
  Nav,
  IconButton,
} from "../components/ui";
import {
  loadSegments,
  readPlans,
  validatePlan,
  weekdays,
  type Schedule,
} from "../lib/planner";
import { fmt } from "../lib/design";

export function Planner() {
  const { go, toast, record } = useApp();
  const [plans, setPlans] = useState<Schedule[]>(() =>
    readPlans(localStorage.getItem("specwatt-plans")),
  );
  const [draft, setDraft] = useState<Schedule | null>(null);
  const [selectedDay, setSelectedDay] = useState("Вт");
  const [validation, setValidation] = useState("");
  useDialogFocus(Boolean(draft), ".bottom-sheet", () => setDraft(null));
  const segments = loadSegments(plans, selectedDay);
  const peak = Math.max(...segments.map((s) => s.watts));
  const visible = plans
    .filter((p) => p.days.includes(selectedDay))
    .sort((a, b) => a.time.localeCompare(b.time));
  const y = (watts: number) => 102 - (watts / 7) * 84;
  const path = segments
    .map(
      (s, i) =>
        `${i === 0 ? "M" : "L"}${(s.start / 1440) * 300} ${y(s.watts)}H${(s.end / 1440) * 300}`,
    )
    .join(" ");
  function persist(next: Schedule[]) {
    localStorage.setItem("specwatt-plans", JSON.stringify(next));
    setPlans(next);
  }
  function open(plan?: Schedule) {
    setValidation("");
    setDraft(
      plan
        ? { ...plan, days: [...plan.days] }
        : {
            id: Date.now(),
            channel: "CH2",
            time: "19:00",
            end: "22:30",
            name: "Вечерний свет",
            enabled: true,
            days: ["Пн", "Вт", "Ср", "Чт", "Пт"],
          },
    );
  }
  function save() {
    if (!draft) return;
    const error = validatePlan(draft, plans);
    if (error) {
      setValidation(error);
      return;
    }
    const exists = plans.some((p) => p.id === draft.id);
    persist([...plans.filter((p) => p.id !== draft.id), draft]);
    record({
      title: exists ? "Демо-план обновлён" : "Демо-план сохранён",
      detail: `${draft.channel} · ${draft.time}–${draft.end} · выполнение не подключено`,
      kind: "auto",
      channel: draft.channel,
    });
    setDraft(null);
    toast("Расписание сохранено в демо. Выполнение не подключено.");
  }
  function togglePlan(plan: Schedule) {
    const next = { ...plan, enabled: !plan.enabled };
    const error = validatePlan(next, plans);
    if (error) {
      toast(error);
      return;
    }
    persist(plans.map((p) => (p.id === next.id ? next : p)));
    record({
      title: `Демо-план ${next.enabled ? "включён" : "приостановлен"}`,
      detail: `${next.channel} · фоновое выполнение не подключено`,
      kind: "auto",
      channel: next.channel,
    });
  }
  return (
    <>
      <main className="screen-content planner-content">
        <Header
          title="План нагрузки"
          subtitle="У каждого света — своё время."
          back
          action="none"
        />
        <div className="planner-month">
          <span>РАСПИСАНИЙ ПО ДНЯМ</span>
          <span>Локальный демо-план</span>
        </div>
        <div className="planner-week">
          {weekdays.map((d) => (
            <button
              key={d}
              className={selectedDay === d ? "selected" : ""}
              aria-pressed={selectedDay === d}
              onClick={() => setSelectedDay(d)}
            >
              <span>{d}</span>
              <b>
                {plans
                  .filter((p) => p.enabled && p.days.includes(d))
                  .length.toString()
                  .padStart(2, "0")}
              </b>
              {plans.some((p) => p.enabled && p.days.includes(d)) && <i />}
            </button>
          ))}
        </div>
        <section className="load-preview material">
          <div>
            <span className="eyebrow">
              {selectedDay.toUpperCase()} / РАСЧЁТ ПО ПЛАНУ
            </span>
            <DemoBadge compact />
          </div>
          <h2>
            Пиковая нагрузка <span>{fmt(peak)} Вт</span>
          </h2>
          <div className="timeline-preview">
            <div className="timeline-limit">7 Вт — лимит</div>
            <svg
              viewBox="0 0 300 112"
              role="img"
              aria-label={`Расчёт по расписаниям на ${selectedDay}. Пик ${fmt(peak)} Вт, CH3 постоянно 2,4 Вт.`}
            >
              <path d="M0 18H300" stroke="#edb17c70" strokeDasharray="4 5" />
              <path d="M0 60H300M0 102H300" stroke="#ffffff10" />
              <path d={`${path}L300 112H0Z`} fill="#edb17c12" />
              <path d={`M0 ${y(2.4)}H300`} stroke="#b8c9b080" strokeWidth="2" />
              <path
                d={path}
                stroke="#edb17c"
                strokeWidth="2.5"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              {["00:00", "06:00", "12:00", "18:00", "24:00"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="timeline-key">
            <span>
              <i />
              По расписаниям
            </span>
            <span>
              <i />
              CH3 · 2,4 Вт
            </span>
          </div>
          <p>
            По номиналам и интервалам, без ручных состояний. Только демо;
            команды по времени не выполняются.
          </p>
        </section>
        <SectionTitle action="Добавить" onClick={() => open()}>
          Ваши расписания
        </SectionTitle>
        {plans.length === 0 ? (
          <div className="empty-schedules">
            <span>
              <Clock3 size={27} />
            </span>
            <h3>Начните с тихого вечера.</h3>
            <p>
              Задайте время для CH1 или CH2.
              <br />
              CH3 останется вне расписаний.
            </p>
            <button onClick={() => open()}>
              <Plus size={16} />
              Первое расписание
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-schedules">
            <span>
              <Clock3 size={26} />
            </span>
            <h3>День без расписаний.</h3>
            <p>
              На {selectedDay} планов нет. Выберите другой день или добавьте
              свой.
            </p>
          </div>
        ) : (
          <div className="schedule-list">
            {visible.map((p) => (
              <article className="schedule-block" key={p.id}>
                <div className="schedule-item">
                  <div className="schedule-time">
                    {p.time}
                    <span>{p.end}</span>
                  </div>
                  <div>
                    <strong>{p.name}</strong>
                    <span>
                      {p.channel} · {p.days.join(", ")}
                    </span>
                    <small>
                      {p.enabled ? "Сохранено · только демо" : "Приостановлено"}
                    </small>
                  </div>
                  <Toggle
                    label={`Расписание ${p.name}`}
                    checked={p.enabled}
                    onChange={() => togglePlan(p)}
                  />
                </div>
                <div className="plan-actions">
                  <button
                    onClick={() => open(p)}
                    aria-label={`Изменить расписание ${p.name}`}
                  >
                    <Pencil size={14} />
                    Изменить
                  </button>
                  <button
                    aria-label={`Удалить расписание ${p.name}`}
                    onClick={() => {
                      persist(plans.filter((v) => v.id !== p.id));
                      record({
                        title: "Демо-план удалён",
                        detail: p.name,
                        kind: "auto",
                        channel: p.channel,
                      });
                      toast("Демо-расписание удалено");
                    }}
                  >
                    <Trash2 size={14} />
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <button className="protection-line" onClick={() => go("protected")}>
          <span className="shield-mini">
            <ShieldCheck size={20} />
          </span>
          <span>
            <b>Защита важнее расписания</b>
            <small>Пересечения выше 7 Вт не сохраняются</small>
          </span>
          <ChevronRight size={17} />
        </button>
      </main>
      <Nav active="autopilot" />
      {draft && (
        <div className="sheet-backdrop" onClick={() => setDraft(null)}>
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
                onClick={() => setDraft(null)}
              />
            </div>
            <label className="form-label">
              Канал
              <select
                aria-label="Канал"
                value={draft.channel}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    channel: e.target.value as Schedule["channel"],
                    name:
                      e.target.value === "CH1"
                        ? "Основной свет"
                        : "Вечерний свет",
                  })
                }
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
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                  required
                />
              </label>
              <label className="form-label">
                Выключить в
                <input
                  type="time"
                  value={draft.end}
                  onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                  required
                />
              </label>
            </div>
            <span className="form-label">Повторять</span>
            <div className="day-selector">
              {weekdays.map((d) => (
                <button
                  aria-pressed={draft.days.includes(d)}
                  className={draft.days.includes(d) ? "selected" : ""}
                  key={d}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      days: draft.days.includes(d)
                        ? draft.days.filter((v) => v !== d)
                        : [...draft.days, d],
                    })
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
              Сохраняется в этом браузере. CH3 защищён; выполнение по времени не
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
