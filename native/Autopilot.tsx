import React from "react";
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
export function NativeAutopilot(m: NativeModel & NativeRuntime) {
  return (
    <ScreenShell>
      <SourceLabel link={m.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Правила света
      </Copy>
      <Surface>
        <Copy style={s.caption}>ДЕМО-АВТОПИЛОТ</Copy>
        <NativeToggle
          label="Демо-автопилот"
          detail={m.auto ? "Правила разрешены" : "Сначала — разрешение"}
          value={m.auto}
          onChange={m.changeAuto}
          disabled={m.link !== "online"}
        />
        <Copy style={s.muted}>
          Фоновые команды не выполняются. Вы сохраняете ручной контроль.
        </Copy>
      </Surface>
      <Copy style={s.section}>Разрешённые каналы</Copy>
      {(["CH1", "CH2"] as const).map((id) => (
        <NativeToggle
          key={id}
          label={`Разрешить авто для ${id}`}
          detail={m.allow[id] ? "Разрешение выдано" : "Нужно ваше разрешение"}
          value={m.allow[id]}
          onChange={() => m.changeConsent(id)}
        />
      ))}
      <Copy style={s.section}>Тихий вечер · пример правила</Copy>
      {[
        "01 · 19:00 — условие",
        "02 · Разрешение CH2",
        "03 · Проверка нагрузки ≤ 7 Вт",
        m.allow.CH2
          ? "04 · Предполагается включение LED-ленты"
          : "04 · Стоп: нет разрешения CH2",
      ].map((t) => (
        <NativeRow key={t} title={t} />
      ))}
      <Copy style={s.muted}>
        Пример не исполняется. CH3 исключён из правил.
      </Copy>
      <NativeButton
        label="План нагрузки"
        onPress={() => m.onNavigate("planner")}
      />
    </ScreenShell>
  );
}
