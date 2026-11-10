import React from "react";
import Svg, {
  Path,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import {
  Copy,
  NativeButton,
  ScreenShell,
  SourceLabel,
  Surface,
  s,
} from "./components";
import { NativeToggle, NativeRow } from "./controls";
import type { NativeModel } from "./screens";
import type { NativeRuntime } from "./useNativeDemo";
export function NativeDeviceDetail(model: NativeModel & NativeRuntime) {
  const on = model.link === "online" && model.channels.CH1;
  const last = model.events.find((e) => e.channel === "CH1");
  return (
    <ScreenShell>
      <SourceLabel link={model.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Основной свет
      </Copy>
      <Copy style={s.caption}>СВЕТИЛЬНИК / CH1</Copy>
      <Surface>
        <Svg
          width="100%"
          height={220}
          viewBox="0 0 300 220"
          accessible
          accessibilityLabel="Дисковый подвесной светильник CH1"
        >
          <Defs>
            <LinearGradient id="metal" x2="1">
              <Stop stopColor="#342e27" />
              <Stop offset=".48" stopColor="#b89b71" />
              <Stop offset="1" stopColor="#262824" />
            </LinearGradient>
          </Defs>
          <Path d="M149 0V80" stroke="#77776b" strokeWidth={1.5} />
          <Path d="M144 76h12v12h-12Z" fill="#71634d" />
          <Path
            d="M52 114C64 92 102 81 150 81S236 92 248 114L245 123H55Z"
            fill="url(#metal)"
            stroke="#ad936b"
            strokeWidth={0.6}
          />
          <Ellipse
            cx={150}
            cy={121}
            rx={96}
            ry={22}
            fill="#151a18"
            stroke="#a28964"
          />
          <Ellipse
            cx={150}
            cy={123}
            rx={87}
            ry={16}
            fill={on ? "#ffe6b6" : "#4a5146"}
          />
        </Svg>
        <Copy>
          {model.link !== "online"
            ? "Нет подтверждения"
            : on
              ? "Включено · 1,8 Вт"
              : "Выключено · 0 Вт"}
        </Copy>
      </Surface>
      <NativeToggle
        label="Светильник: питание"
        value={model.channels.CH1}
        onChange={() => model.onToggle("CH1")}
        disabled={model.link !== "online"}
      />
      <NativeRow
        title="Номинальная мощность · 1,8 Вт"
        detail="Только on/off. Аппаратное диммирование не подтверждено."
      />
      <NativeRow
        title="Правила автоматизации"
        detail="Явные разрешения, без фоновых команд"
        onPress={() => model.onNavigate("autopilot")}
      />
      <NativeRow
        title="Расписание"
        onPress={() => model.onNavigate("planner")}
      />
      <Copy style={s.section}>История канала</Copy>
      <Copy style={s.muted}>
        {last ? `${last.time} · ${last.title}` : "Ручных действий пока нет"}
      </Copy>
      <NativeButton
        label="Открыть журнал"
        onPress={() => model.onNavigate("journal")}
      />
    </ScreenShell>
  );
}
