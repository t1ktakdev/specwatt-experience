import React, { useState } from "react";
import { View, Pressable } from "react-native";
import {
  Copy,
  NativeButton,
  NativeIcon,
  ScreenShell,
  Surface,
  s,
} from "./components";
import type { NativeModel } from "./screens";
import type { NativeRuntime } from "./useNativeDemo";
import type { LogEntry } from "../src/types";
export function NativeJournal(m: NativeModel & NativeRuntime) {
  const [filter, setFilter] = useState("Все");
  const kinds: Record<string, LogEntry["kind"][]> = {
    Все: ["light", "shield", "auto", "system", "warning"],
    Защита: ["shield", "warning"],
    Управление: ["light"],
    Авто: ["auto"],
  };
  const visible = m.events.filter((e) => kinds[filter].includes(e.kind));
  return (
    <ScreenShell>
      <Copy accessibilityRole="header" style={s.title}>
        Журнал событий
      </Copy>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#ffffff14",
          paddingVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Copy style={[s.metric, { fontSize: 64, color: "#edb17c" }]}>
          {String(m.events.length).padStart(2, "0")}
        </Copy>
        <View style={{ flex: 1 }}>
          <Copy style={s.caption}>СОБЫТИЯ ДЕМО-СЕССИИ</Copy>
          <Copy style={s.muted}>CH3 защищён</Copy>
        </View>
        <NativeIcon kind="energy" color="#b8c9b0" />
      </View>
      <View style={s.grid}>
        {Object.keys(kinds).map((f) => (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: f === filter }}
            onPress={() => setFilter(f)}
            style={s.subtleButton}
          >
            <Copy>{f}</Copy>
          </Pressable>
        ))}
      </View>
      {visible.length === 0 ? (
        <Surface>
          <Copy style={s.section}>Действий пока нет</Copy>
          <Copy style={s.muted}>
            В этом разделе появятся ваши действия текущей сессии.
          </Copy>
        </Surface>
      ) : (
        visible.map((e, i) => (
          <View
            key={i}
            style={[
              s.subtleButton,
              {
                gap: 8,
                borderLeftWidth: 2,
                borderLeftColor: e.kind === "warning" ? "#f1a893" : "#b8c9b0",
              },
            ]}
          >
            <Copy
              style={[
                s.caption,
                { color: e.kind === "warning" ? "#f1a893" : "#edb17c" },
              ]}
            >
              {e.time} · {e.channel || "СИСТЕМА"}
            </Copy>
            <Copy style={s.section}>{e.title}</Copy>
            <Copy style={s.muted}>{e.detail}</Copy>
          </View>
        ))
      )}
      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#ffffff14",
          paddingTop: 24,
          gap: 18,
        }}
      >
        <Copy style={s.caption}>ПРОЗРАЧНОСТЬ КАЖДОГО ДЕЙСТВИЯ</Copy>
        <Copy style={[s.title, { fontSize: 25 }]}>
          У каждого решения — свой след.
        </Copy>
        <View style={s.source}>
          {(
            [
              ["light", "Переключения"],
              ["warning", "Отказы"],
              ["auto", "Разрешения"],
            ] as const
          ).map(([kind, label]) => (
            <View key={kind}>
              <Copy style={{ fontSize: 28, lineHeight: 36 }}>
                {m.events.filter((e) => e.kind === kind).length}
              </Copy>
              <Copy style={s.caption}>{label}</Copy>
            </View>
          ))}
        </View>
      </View>
      <Copy style={s.muted}>
        Не подтверждает отправку или получение команд оборудованием.
      </Copy>
      <NativeButton
        label="К устройствам"
        onPress={() => m.onNavigate("devices")}
      />
    </ScreenShell>
  );
}
