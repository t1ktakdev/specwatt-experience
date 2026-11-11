import { useEffect, useState, useId } from "react";
import { Zap } from "lucide-react";
import { fmt, fmtEnergy } from "../lib/design";
import { chartScale, data, type Period } from "../lib/demo-energy";
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
        <path
          d="M29.6 90.4A43 43 0 1 1 90.4 90.4"
          fill="none"
          stroke="#ffffff18"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {current > 0 &&
          (() => {
            const angle =
              ((135 + Math.min(current / limit, 1) * 270) * Math.PI) / 180;
            return (
              <path
                d={`M29.6 90.4A43 43 0 ${current / limit > 2 / 3 ? 1 : 0} 1 ${60 + 43 * Math.cos(angle)} ${60 + 43 * Math.sin(angle)}`}
                fill="none"
                stroke="#edb17c"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })()}
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
  const scale = chartScale(period);
  const id = useId();
  const [selected, setSelected] = useState(values.length - 1);
  useEffect(() => setSelected(values.length - 1), [period, values.length]);
  const sel = Math.min(selected, values.length - 1);
  const x = (i: number) => 44 + ((i + 0.5) / values.length) * 280;
  const unit = period === "День" ? "Вт" : "кВт·ч";
  const label = (i: number) =>
    period === "День"
      ? `${String(i).padStart(2, "0")}:00–${String(i + 1).padStart(2, "0")}:00`
      : period === "Неделя"
        ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]
        : ["1–7 ноября", "8–14 ноября", "15–21 ноября", "22–30 ноября"][i];
  const choose = (clientX: number, element: SVGSVGElement) => {
    const box = element.getBoundingClientRect();
    const coordinate = ((clientX - box.left) / box.width) * 336;
    setSelected(
      Math.max(
        0,
        Math.min(
          values.length - 1,
          Math.floor(((coordinate - 44) / 280) * values.length),
        ),
      ),
    );
  };
  return (
    <div className="chart chart-v4">
      <div className="chart-selection">
        <span>{label(sel)}</span>
        <output aria-live="polite">
          {fmtEnergy(values[sel])} {unit}
        </output>
      </div>
      <svg
        key={period}
        fontFamily="Manrope"
        viewBox="0 0 336 216"
        role="img"
        aria-labelledby={id}
        onPointerMove={(e) => choose(e.clientX, e.currentTarget)}
        onPointerDown={(e) => choose(e.clientX, e.currentTarget)}
      >
        <title
          id={id}
        >{`График за ${period}. ${period === "День" ? "Средняя мощность, Вт" : "Энергия, кВт·ч"}. Выбор интервала доступен ползунком ниже.`}</title>
        <text x="4" y="10" fill="#c4c6be" fontSize="11">
          {unit}
        </text>
        {scale.ticks.map((t) => (
          <g key={t}>
            <path
              d={`M44 ${scale.y(t)}H324`}
              stroke="#ffffff18"
              strokeDasharray={t === 0 ? undefined : "2 4"}
            />
            <text
              x="34"
              y={scale.y(t) + 4}
              textAnchor="end"
              fill="#b9bcb5"
              fontSize="11"
            >
              {fmtEnergy(t)}
            </text>
          </g>
        ))}
        {values.map((v, i) => (
          <rect
            key={i}
            className="energy-bar"
            x={x(i) - Math.max(3, (280 / values.length) * 0.3)}
            y={scale.y(v)}
            width={Math.max(6, (280 / values.length) * 0.6)}
            height={184 - scale.y(v)}
            rx="2"
            fill={i === sel ? "#f5bf8c" : "#9d8d79"}
            opacity={i === sel ? 1 : 0.9}
          />
        ))}
        <path
          d={`M${x(sel)} 20V184`}
          stroke="#edb17c"
          strokeDasharray="2 4"
          opacity=".65"
        />
        <circle
          cx={x(sel)}
          cy={scale.y(values[sel])}
          r="4"
          fill="#fff0d8"
          stroke="#edb17c"
          strokeWidth="2"
        />
        {(period === "День"
          ? [
              { i: 0, t: "00" },
              { i: 6, t: "06" },
              { i: 12, t: "12" },
              { i: 18, t: "18" },
              { i: 23, t: "23" },
            ]
          : values.map((_, i) => ({
              i,
              t:
                period === "Неделя"
                  ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]
                  : ["1–7", "8–14", "15–21", "22–30"][i],
            }))
        ).map((p) => (
          <text
            key={p.i}
            x={x(p.i)}
            y="207"
            textAnchor="middle"
            fill="#b9bcb5"
            fontSize="11"
          >
            {p.t}
          </text>
        ))}
      </svg>
      <label className="chart-scrubber">
        <span>
          Выбрать интервал <span aria-hidden="true">← →</span>
        </span>
        <input
          className="chart-point-control"
          type="range"
          aria-label="Интервал графика"
          aria-valuetext={`${label(sel)}: ${fmtEnergy(values[sel])} ${unit}`}
          min="0"
          max={values.length - 1}
          value={sel}
          onChange={(e) => setSelected(+e.target.value)}
        />
      </label>
    </div>
  );
}
