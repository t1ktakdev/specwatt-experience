import React from "react";
import { NativeProduct } from "./Product";
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
      <Copy style={s.caption}>СВЕТИЛЬНИК / CH1 · КОНЦЕПЦИЯ</Copy>
      <Surface>
        <NativeProduct
          id="CH1"
          on={on}
          known={model.link === "online"}
          assets={model.assets}
          height={260}
        />
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
