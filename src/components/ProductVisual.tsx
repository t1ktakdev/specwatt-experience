import { useId } from "react";
/** Original conceptual objects. Never presented as photographs of the real bench. */
export function ProductVisual({
  id,
  on,
  known = true,
}: {
  id: "CH1" | "CH2";
  on: boolean;
  known?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  if (id === "CH1")
    return (
      <img
        className="product-visual pendant-product"
        src={`./assets/pendant-concept-${known && on ? "on" : "off"}.webp`}
        width={960}
        height={640}
        alt="Концептуальный дисковый светильник из бронзы и графита"
      />
    );
  return (
    <svg
      className="product-visual led-product"
      viewBox="0 0 300 150"
      fill="none"
      role="img"
      aria-label="Концептуальный алюминиевый LED-профиль CH2"
    >
      <defs>
        <linearGradient id={`${uid}metal`} x2="0" y2="1">
          <stop stopColor="#777a79" />
          <stop offset=".3" stopColor="#343a3a" />
          <stop offset="1" stopColor="#14191a" />
        </linearGradient>
        <linearGradient id={`${uid}light`}>
          <stop stopColor={known && on ? "#f4bf86" : "#707471"} />
          <stop offset=".6" stopColor={known && on ? "#ffe7bd" : "#999c92"} />
          <stop offset="1" stopColor={known && on ? "#e6aa70" : "#595f5c"} />
        </linearGradient>
      </defs>
      <path d="m27 105 230-65 22 13-230 70Z" fill="#0f1314" />
      <path
        d="m27 96 230-65 22 13-230 70Z"
        fill={`url(#${uid}metal)`}
        stroke="#8f9290"
        strokeWidth=".5"
      />
      <path d="m32 98 225-63 15 9L47 108Z" fill={`url(#${uid}light)`} />
      <path
        d="m27 96 22 18v9l-22-12Z"
        fill="#343b3c"
        stroke="#6b7270"
        strokeWidth=".5"
      />
      <path d="m49 114 230-70v9L49 123Z" fill="#242b2c" />
      <path d="m56 116 215-64" stroke="#a4aca5" strokeOpacity=".25" />
      <path
        d="m39 127 230-66"
        stroke={known && on ? "#edb17c" : "#363b37"}
        strokeOpacity=".12"
        strokeWidth="10"
      />
    </svg>
  );
}
