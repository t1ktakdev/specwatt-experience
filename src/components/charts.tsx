import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { fmt, fmtEnergy } from "../lib/design";
import { data, type Period } from "../lib/demo-energy";
export type { Period } from "../lib/demo-energy";

export function PowerGauge({
  value = 6.6,
  limit = 7,
}: {
  value?: number | null;
  limit?: number;
}) {
  const current = value ?? 0;
  return (
    <div className="power-gauge">
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label={
          value === null
            ? "Текущая мощность неизвестна"
            : `${fmt(current)} ватт из ${limit}`
        }
      >
        <defs>
          <linearGradient id="gaugeAmber" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#a16637" />
            <stop offset=".55" stopColor="#f2a765" />
            <stop offset="1" stopColor="#ffe0a4" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="49"
          fill="none"
          stroke="#ffffff0a"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="43"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="4"
          strokeDasharray="205 70"
          transform="rotate(135 60 60)"
        />
        <circle
          cx="60"
          cy="60"
          r="43"
          fill="none"
          stroke="url(#gaugeAmber)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${Math.min(current / limit, 1) * 205} 300`}
          transform="rotate(135 60 60)"
        />
        {Array.from({ length: 25 }, (_, i) => {
          const a = ((135 + i * 11.25) * Math.PI) / 180;
          return (
            <path
              key={i}
              d={`M${60 + 53 * Math.cos(a)} ${60 + 53 * Math.sin(a)}L${60 + 56 * Math.cos(a)} ${60 + 56 * Math.sin(a)}`}
              stroke={i < (current / limit) * 24 ? "#e0b382" : "#555451"}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <span>
        <Zap size={25} strokeWidth={1.3} />
        <small>{value === null ? "Нет данных" : `из ${limit} Вт`}</small>
      </span>
    </div>
  );
}

export function MiniSpark() {
  return (
    <svg
      className="mini-spark"
      width="72"
      height="26"
      viewBox="0 0 72 26"
      aria-hidden="true"
    >
      <path
        d="M1 21 10 20 16 15 23 18 31 9 39 12 46 5 55 9 63 4 71 5"
        stroke="#b7c7af"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EnergyChart({ period }: { period: Period }) {
  const values = data[period];
  const max = period === "День" ? 8 : period === "Неделя" ? 0.2 : 1.2;
  const [selected, setSelected] = useState(values.length - 1);
  useEffect(() => setSelected(values.length - 1), [period, values.length]);
  const width = 312,
    height = 158;
  const points = values
    .map(
      (v, i) =>
        `${12 + (i * (width - 24)) / (values.length - 1)},${height - 12 - (v / max) * (height - 28)}`,
    )
    .join(" ");
  const sel = Math.min(selected, values.length - 1);
  const x = 12 + (sel * (width - 24)) / (values.length - 1),
    y = height - 12 - (values[sel] / max) * (height - 28);
  const unit = period === "День" ? "Вт" : "кВт·ч";
  const sampleLabel =
    period === "День"
      ? `${String(sel).padStart(2, "0")}:00–${String(sel + 1).padStart(2, "0")}:00`
      : period === "Неделя"
        ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][sel]
        : ["1–7 ноября", "8–14 ноября", "15–21 ноября", "22–30 ноября"][sel];
  return (
    <div className="chart">
      <div className="chart-selection">
        <span>{sampleLabel}</span>
        <output aria-live="polite">
          {fmtEnergy(values[sel])} {unit}
        </output>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`График расхода за период ${period}`}
      >
        <defs>
          <linearGradient
            id={`chartFill-${period}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop stopColor="#e5a571" stopOpacity=".24" />
            <stop offset="1" stopColor="#e5a571" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path
              d={`M10 ${16 + i * 32.5}H302`}
              stroke="#ffffff12"
              strokeDasharray="3 5"
            />
            <text
              x="305"
              y={20 + i * 32.5}
              textAnchor="end"
              fill="#afb4aa"
              fontSize="9"
            >
              {fmtEnergy(max * (1 - i / 4))}
            </text>
          </g>
        ))}
        <polygon
          points={`12,158 ${points} 300,158`}
          fill={`url(#chartFill-${period})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke="#efb37c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={`M${x} ${y}V158`} stroke="#d09c6a" strokeDasharray="3 4" />
        <circle cx={x} cy={y} r="8" fill="#eeb17b" fillOpacity=".12" />
        <circle
          cx={x}
          cy={y}
          r="3.5"
          fill="#ffe5c5"
          stroke="#efb37c"
          strokeWidth="2"
        />
        {values.map((_, i) => (
          <rect
            key={i}
            x={i * (width / values.length)}
            y="0"
            width={width / values.length}
            height={height}
            fill="transparent"
            onClick={() => setSelected(i)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
      <input
        className="chart-point-control"
        type="range"
        aria-label="Интервал графика"
        aria-valuetext={`${sampleLabel}: ${fmtEnergy(values[sel])} ${unit}`}
        min="0"
        max={values.length - 1}
        value={sel}
        onChange={(e) => setSelected(+e.target.value)}
      />
      <span
        className="chart-tooltip"
        style={{
          left: `${Math.max(14, Math.min(83, (x / width) * 100))}%`,
          top: `${Math.max(26, (y / height) * 150)}px`,
        }}
      >
        {fmtEnergy(values[sel])} <small>{unit}</small>
      </span>
      <div className="chart-labels">
        {(period === "День"
          ? ["00:00", "06:00", "12:00", "18:00", "23:00"]
          : period === "Неделя"
            ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
            : ["1–7", "8–14", "15–21", "22–30"]
        ).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
