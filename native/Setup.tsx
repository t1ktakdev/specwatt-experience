import React, { useState, useEffect } from "react";
import { View, Pressable, BackHandler } from "react-native";
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
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (step > 1) setStep(step - 1);
        else onNavigate("welcome");
        return true;
      },
    );
    return () => subscription.remove();
  }, [step, onNavigate]);
  return (
    <ScreenShell>
      <View style={[s.source, { alignItems: "center" }]}>
        <Copy style={s.caption}>SPECWATT / 0{step} ИЗ 03</Copy>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          style={s.iconButton}
          onPress={() => (step > 1 ? setStep(step - 1) : onNavigate("welcome"))}
        >
          <NativeIcon kind="back" color="#d9dbd3" size={20} />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={{
              height: 2,
              flex: 1,
              backgroundColor: n <= step ? "#edb17c" : "#ffffff18",
            }}
          />
        ))}
      </View>
      <View
        style={{
          padding: step === 2 ? 12 : 20,
          gap: 12,
          borderRadius: 20,
          backgroundColor: step === 3 ? "#222c26" : "#222728",
        }}
      >
        <View style={[s.source, { alignItems: "center" }]}>
          <View style={{ alignItems: "center", gap: 6 }}>
            <NativeIcon kind="grid" size={step === 2 ? 24 : 38} />
            <Copy style={s.muted}>Интерфейс</Copy>
          </View>
          <NativeIcon kind={step === 3 ? "check" : "arrow"} />
          <View style={{ alignItems: "center", gap: 6 }}>
            <NativeIcon
              kind="shield"
              size={step === 2 ? 24 : 38}
              color="#b8c9b0"
            />
            <Copy style={s.muted}>Демо-модель</Copy>
          </View>
        </View>
        <Copy style={s.muted}>CH1 · 1,8 Вт / CH2 · 4,2 Вт / CH3 · 2,4 Вт</Copy>
        <Copy style={s.caption}>СХЕМА ДЕМОНСТРАЦИИ, НЕ ПЛАТА ESP32</Copy>
      </View>
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
              label="Пример адреса сервера · без подключения"
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
