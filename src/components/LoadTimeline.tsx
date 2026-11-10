import { loadSegments, type Schedule } from "../lib/planner";
import { nominal } from "../model";
import { fmt } from "../lib/design";

/** Nominal schedule calculation only. Never presents these intervals as telemetry. */
export function LoadTimeline({
  plans,
  day,
  compact = false,
}: {
  plans: Schedule[];
  day: string;
  compact?: boolean;
}) {
  const segments = loadSegments(plans, day);
  const peak = Math.max(...segments.map((s) => s.watts));
  const y = (w: number) => 126 - (w / 8.4) * 100;
  const path = segments
    .map(
      (s, i) =>
        `${i === 0 ? "M" : "L"}${36 + (s.start / 1440) * 288} ${y(s.watts)}H${36 + (s.end / 1440) * 288}`,
    )
    .join(" ");
  return (
    <div className={`load-timeline ${compact ? "compact" : ""}`}>
      <svg
        viewBox="0 0 336 156"
        fontFamily="Manrope"
        role="img"
        aria-label={`План на ${day}: пик ${fmt(peak)} Вт. Предел 7 Вт. Защищённая база 2,4 Вт.`}
      >
        {[0, 2.4, 7, 8.4].map((w) => (
          <g key={w}>
            <text
              x="28"
              y={y(w) + 4}
              textAnchor="end"
              fontSize="11"
              fill={w === 7 ? "#edb17c" : "#b8bdb5"}
            >
              {fmt(w)}
            </text>
            <path
              d={`M36 ${y(w)}H324`}
              stroke={w === 7 ? "#edb17c" : "#ffffff18"}
              strokeDasharray={w === 7 ? "4 4" : "2 5"}
            />
          </g>
        ))}
        <text x="0" y="12" fontSize="10" fill="#b8bdb5">
          Вт
        </text>
        <path d={`${path}L324 126H36Z`} fill="#edb17c16" />
        <path d={`M36 ${y(2.4)}H324`} stroke="#b8c9b0" strokeWidth="2" />
        {segments
          .filter((s) => s.watts > 7)
          .map((s) => (
            <rect
              key={s.start}
              x={36 + (s.start / 1440) * 288}
              width={((s.end - s.start) / 1440) * 288}
              y="21"
              height="105"
              fill="#f1a893"
              fillOpacity=".22"
            />
          ))}
        <path
          d={path}
          stroke={peak > 7 ? "#f1a893" : "#edb17c"}
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        {[0, 6, 12, 18, 24].map((h) => (
          <text
            key={h}
            x={36 + (h / 24) * 288}
            y="148"
            textAnchor="middle"
            fontSize="10"
            fill="#b8bdb5"
          >
            {String(h).padStart(2, "0")}
          </text>
        ))}
      </svg>
      {!compact && (
        <div className="channel-lanes">
          {(["CH1", "CH2", "CH3"] as const).map((id) => (
            <div className={`channel-lane lane-${id}`} key={id}>
              <span>
                {id}
                <small>{fmt(nominal[id])} Вт</small>
              </span>
              <div className="lane-track">
                {id === "CH3" ? (
                  <i className="base-lane" />
                ) : (
                  plans
                    .filter(
                      (p) =>
                        p.enabled && p.channel === id && p.days.includes(day),
                    )
                    .map((p) => (
                      <i
                        key={p.id}
                        style={{
                          left: `${((Number(p.time.slice(0, 2)) * 60 + Number(p.time.slice(3))) / 1440) * 100}%`,
                          width: `${((Number(p.end.slice(0, 2)) * 60 + Number(p.end.slice(3)) - (Number(p.time.slice(0, 2)) * 60 + Number(p.time.slice(3)))) / 1440) * 100}%`,
                        }}
                        title={`${p.time}–${p.end}`}
                      />
                    ))
                )}
                <small>
                  {id === "CH3"
                    ? "Постоянная база · вне расписаний"
                    : plans.some(
                          (p) =>
                            p.enabled &&
                            p.channel === id &&
                            p.days.includes(day),
                        )
                      ? "Интервалы по плану"
                      : "Нет интервалов"}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
