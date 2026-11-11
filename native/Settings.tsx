import React from "react";
import { View, Pressable } from "react-native";
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
export function NativeSettings(m: NativeModel & NativeRuntime) {
  return (
    <ScreenShell>
      <SourceLabel link={m.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Настройки
      </Copy>
      <Copy style={s.section}>Соединение</Copy>
      <Surface>
        <Copy style={s.section}>Источник: локальный симулятор</Copy>
        <Copy style={s.muted}>Состояние для просмотра</Copy>
        <View style={s.grid}>
          {(["online", "offline", "loading", "error"] as const).map((state) => (
            <Pressable
              key={state}
              accessibilityRole="radio"
              accessibilityState={{ checked: m.link === state }}
              onPress={() => m.setLink(state)}
              style={[
                s.subtleButton,
                {
                  backgroundColor: m.link === state ? "#3b352e" : "transparent",
                  borderColor: m.link === state ? "#edb17c66" : "#ffffff14",
                  flexBasis: "45%",
                  flexGrow: 1,
                },
              ]}
            >
              <Copy>
                {
                  {
                    online: "Демо доступно",
                    offline: "Нет связи",
                    loading: "Ожидание",
                    error: "Ошибка",
                  }[state]
                }
              </Copy>
            </Pressable>
          ))}
        </View>
      </Surface>
      <Copy style={s.section}>Интерфейс</Copy>
      <NativeRow title="Язык интерфейса" detail="Русский" />
      <NativeToggle
        label="Меньше движения"
        detail="Системное уменьшение движения также учитывается"
        value={m.reduceMotion}
        onChange={() => m.setReduceMotion(!m.reduceMotion)}
      />
      <NativeRow
        title="Подключение ESP32"
        onPress={() => m.onNavigate("setup")}
      />
      <NativeRow
        title="Журнал событий"
        onPress={() => m.onNavigate("journal")}
      />
      <Copy style={s.section}>Безопасность и данные</Copy>
      <NativeRow
        title="Защита CH3"
        detail="Исключён из управления и расписаний"
        onPress={() => m.onNavigate("protected")}
      />
      <NativeRow
        title="Лимит нагрузки · 7 Вт"
        detail="Проверяется общей моделью до изменения состояния"
      />
      <NativeRow
        title="Локальная сессия"
        detail="Этот native preview хранит данные в памяти до перезапуска. Телеметрия и транспорт не подключены."
      />
      <NativeButton label="К главной" onPress={() => m.onNavigate("home")} />
    </ScreenShell>
  );
}
