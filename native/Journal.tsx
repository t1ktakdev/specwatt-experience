import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Copy, NativeButton, ScreenShell, Surface, s } from "./components";
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
      <Copy style={s.muted}>
        {m.events.length} событий локальной демо-сессии
      </Copy>
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
            <Copy style={s.caption}>
              {e.time} · {e.channel || "СИСТЕМА"}
            </Copy>
            <Copy style={s.section}>{e.title}</Copy>
            <Copy style={s.muted}>{e.detail}</Copy>
          </View>
        ))
      )}
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
