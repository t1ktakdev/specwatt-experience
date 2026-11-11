import React from "react";
import { View } from "react-native";
import { NativeProduct } from "./Product";
import {
  NativeHeader,
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
      <NativeHeader title="Основной свет" back />
      <Copy style={s.caption}>СВЕТИЛЬНИК / CH1 · КОНЦЕПЦИЯ</Copy>
      <Surface>
        <NativeProduct
          id="CH1"
          on={on}
          known={model.link === "online"}
          assets={model.assets}
          height={232}
        />
        <Copy>
          {model.link !== "online"
            ? "Нет подтверждения"
            : on
              ? "Включено · 1,8 Вт"
              : "Выключено · 0 Вт"}
        </Copy>
      </Surface>
      <Surface>
        <NativeToggle
          label="Светильник: питание"
          value={model.channels.CH1}
          onChange={() => model.onToggle("CH1")}
          disabled={model.link !== "online"}
        />
      </Surface>
      <View style={[s.source, { paddingVertical: 12 }]}>
        <View style={{ flex: 1, gap: 8 }}>
          <Copy style={s.caption}>НОМИНАЛЬНАЯ МОЩНОСТЬ</Copy>
          <Copy style={{ fontSize: 30, lineHeight: 40 }}>
            1,8 <Copy style={s.unit}>Вт</Copy>
          </Copy>
          <Copy style={s.muted}>Управляемый</Copy>
        </View>
        <View
          style={{
            flex: 1,
            gap: 8,
            paddingLeft: 16,
            borderLeftWidth: 1,
            borderColor: "#ffffff12",
          }}
        >
          <Copy style={s.caption}>КАНАЛ</Copy>
          <Copy style={{ fontSize: 30, lineHeight: 40 }}>CH1</Copy>
          <Copy style={s.muted}>Только on/off</Copy>
        </View>
      </View>
      <Copy style={s.section}>Параметры управления</Copy>
      <NativeRow
        title="Правила автоматизации"
        detail="Явные разрешения, без фоновых команд"
        onPress={() => model.onNavigate("autopilot")}
      />
      <NativeRow
        detail="Настроить демо-план"
        title="Расписание"
        onPress={() => model.onNavigate("planner")}
      />
      <Copy style={s.muted}>Аппаратное диммирование не подтверждено.</Copy>
      <Copy style={s.section}>История канала</Copy>
      <Copy style={s.muted}>
        {last ? `${last.time} · ${last.title}` : "Ручных действий пока нет"}
      </Copy>
      <NativeRow
        title="Открыть журнал"
        onPress={() => model.onNavigate("journal")}
      />
    </ScreenShell>
  );
}
