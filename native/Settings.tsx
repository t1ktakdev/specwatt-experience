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
export function NativeSettings(m: NativeModel & NativeRuntime) {
  return (
    <ScreenShell>
      <SourceLabel link={m.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Настройки
      </Copy>
      <Copy style={s.section}>Соединение</Copy>
      <Surface>
        {(["online", "offline", "loading", "error"] as const).map((state) => (
          <NativeToggle
            key={state}
            label={`Предпросмотр: ${state}`}
            detail="Состояние UI, не реальная связь"
            value={m.link === state}
            onChange={() => m.setLink(state)}
          />
        ))}
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
