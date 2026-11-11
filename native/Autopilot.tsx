import React from "react";
import { View } from "react-native";
import { totalWatts } from "../src/model";
import { NativeIcon } from "./components";
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
export function NativeAutopilot(m: NativeModel & NativeRuntime) {
  const projected = totalWatts({ ...m.channels, CH2: true });
  const allowed = m.allow.CH2 && m.link === "online" && projected <= 7;
  return (
    <ScreenShell>
      <NativeHeader title="Правила света" />
      <View
        style={{
          borderLeftWidth: 2,
          borderLeftColor: "#edb17c",
          paddingLeft: 18,
          gap: 10,
        }}
      >
        <Copy style={s.caption}>ДЕМО-АВТОПИЛОТ</Copy>
        <NativeToggle
          emphasis
          label={m.auto ? "Правила разрешены" : "Сначала — разрешение"}
          value={m.auto}
          onChange={m.changeAuto}
          disabled={m.link !== "online"}
        />
        <Copy style={s.muted}>
          Фоновые команды не выполняются. Вы сохраняете ручной контроль.
        </Copy>
      </View>
      <Copy style={s.section}>Разрешённые каналы</Copy>
      {(["CH1", "CH2"] as const).map((id) => (
        <NativeToggle
          key={id}
          label={id === "CH1" ? "Основной свет" : "LED-лента"}
          detail={`${id} · ${m.allow[id] ? "Разрешение выдано" : "Нужно ваше разрешение"}`}
          value={m.allow[id]}
          onChange={() => m.changeConsent(id)}
        />
      ))}
      <Copy style={s.section}>Тихий вечер · пример правила</Copy>
      <View style={{ gap: 0 }}>
        {[
          {
            kind: "auto" as const,
            label: "01 / УСЛОВИЕ",
            title: "Наступает 19:00",
            detail: "Учебный триггер · таймер не запущен",
          },
          {
            kind: "shield" as const,
            label: "02 / ВАШЕ РЕШЕНИЕ",
            title: "Разрешение для CH2",
            detail: m.allow.CH2
              ? "Получено · можно отозвать выше"
              : "Ожидает вашего согласия",
          },
          {
            kind: "settings" as const,
            label: "03 / ПРОВЕРКА БАЛАНСА",
            title:
              m.link === "online"
                ? `${projected.toLocaleString("ru-RU")} Вт из 7 Вт`
                : "Нагрузка неизвестна",
            detail: "CH3 включён в расчёт · 2,4 Вт",
          },
          {
            kind: "arrow" as const,
            label: "04 / РЕЗУЛЬТАТ ПРОВЕРКИ",
            title:
              m.link !== "online"
                ? "Стоп · нет актуальных данных"
                : !m.allow.CH2
                  ? "Стоп · нет разрешения CH2"
                  : projected > 7
                    ? "Стоп · превышен лимит"
                    : "Включение CH2 допустимо",
            detail: "Предпросмотр · действие не выполняется",
          },
        ].map((step, i) => (
          <View
            key={step.label}
            style={{
              flexDirection: "row",
              gap: 16,
              padding: i === 3 ? 16 : 0,
              paddingBottom: 24,
              backgroundColor:
                i === 3 ? (allowed ? "#232c27" : "#2d2b25") : "transparent",
              borderRadius: 14,
            }}
          >
            <View style={{ width: 44, alignItems: "center" }}>
              <View
                style={[
                  s.iconButton,
                  { borderRadius: 13, backgroundColor: "#252a2a" },
                ]}
              >
                <NativeIcon kind={step.kind} />
              </View>
              {i < 3 && (
                <View
                  style={{
                    width: 1,
                    flex: 1,
                    backgroundColor: "#edb17c30",
                    minHeight: 24,
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: 5 }}>
              <Copy style={s.caption}>{step.label}</Copy>
              <Copy style={s.section}>{step.title}</Copy>
              <Copy style={s.muted}>{step.detail}</Copy>
            </View>
          </View>
        ))}
      </View>
      <Copy style={s.muted}>
        Пример не исполняется. CH3 исключён из правил.
      </Copy>
      <NativeRow
        title="План нагрузки"
        onPress={() => m.onNavigate("planner")}
      />
    </ScreenShell>
  );
}
