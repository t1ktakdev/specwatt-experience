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
import { NativeField } from "./controls";
import type { NativeModel } from "./screens";
export function NativeSetup({
  onNavigate,
  initialStep = 1,
}: {
  onNavigate: NativeModel["onNavigate"];
  initialStep?: number;
}) {
  const [step, setStep] = useState(initialStep),
    [mode, setMode] = useState<"demo" | "hardware">("demo"),
    [address, setAddress] = useState("http://127.0.0.1:8000"),
    [error, setError] = useState("");
  return (
    <ScreenShell>
      <Copy style={s.caption}>SPECWATT / 0{step} ИЗ 03</Copy>
      <Pressable
        accessibilityRole="button"
        style={s.subtleButton}
        onPress={() => (step > 1 ? setStep(step - 1) : onNavigate("welcome"))}
      >
        <Copy>← Назад</Copy>
      </Pressable>
      <Surface>
        <View style={s.source}>
          <Copy>Интерфейс</Copy>
          <NativeIcon kind="arrow" />
          <Copy>Демо-модель</Copy>
        </View>
        <Copy style={s.muted}>CH1 · 1,8 Вт / CH2 · 4,2 Вт / CH3 · 2,4 Вт</Copy>
        <Copy style={s.caption}>СХЕМА ДЕМОНСТРАЦИИ, НЕ ПЛАТА ESP32</Copy>
      </Surface>
      <Copy accessibilityRole="header" style={s.title}>
        {step === 1
          ? "Начните с демо. Подключайте осознанно."
          : step === 2
            ? "Параметры подключения"
            : "Интерфейс готов к знакомству"}
      </Copy>
      {step === 1 ? (
        <>
          {(["demo", "hardware"] as const).map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === value }}
              onPress={() => setMode(value)}
              style={[
                s.subtleButton,
                { borderColor: mode === value ? "#edb17c" : "#ffffff18" },
              ]}
            >
              <Copy>
                {value === "demo"
                  ? "Изучить демонстрацию"
                  : "У меня есть контроллер"}
              </Copy>
              <Copy style={s.muted}>
                {value === "demo"
                  ? "Локальные данные, без оборудования"
                  : "Посмотреть требования к подключению"}
              </Copy>
            </Pressable>
          ))}
          <NativeButton
            label="Посмотреть настройку"
            onPress={() => setStep(2)}
          />
        </>
      ) : step === 2 ? (
        mode === "hardware" ? (
          <Surface>
            <Copy style={s.section}>Сопряжение пока недоступно</Copy>
            <Copy style={s.muted}>
              Нужны проверенный протокол ESP32 и подтверждение оборудования.
              Сетевые запросы не отправляются.
            </Copy>
            <NativeButton
              label="Подключение недоступно"
              disabled
              onPress={() => {}}
            />
            <NativeButton
              label="Продолжить в демо"
              onPress={() => setMode("demo")}
            />
          </Surface>
        ) : (
          <>
            <NativeField
              label="Адрес сервера"
              keyboardType="url"
              value={address}
              onChange={setAddress}
            />
            <Copy style={s.muted}>
              Адрес не сохраняется, не проверяется по сети и не передаётся.
            </Copy>
            {error && <Copy accessibilityRole="alert">{error}</Copy>}
            <NativeButton
              label="Продолжить настройку"
              onPress={() => {
                try {
                  const u = new URL(address);
                  if (!["http:", "https:"].includes(u.protocol) || !u.hostname)
                    throw Error();
                  setError("");
                  setStep(3);
                } catch {
                  setError("Укажите адрес с http:// или https://");
                }
              }}
            />
          </>
        )
      ) : (
        <>
          <Surface>
            <Copy style={s.section}>Локальная демо-сессия</Copy>
            <Copy style={s.muted}>
              Физическое устройство не подключено. CH3 защищён в модели.
            </Copy>
          </Surface>
          <NativeButton
            label="Начать знакомство"
            onPress={() => onNavigate("home")}
          />
        </>
      )}
    </ScreenShell>
  );
}
