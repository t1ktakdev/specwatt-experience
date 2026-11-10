import React, { type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  type TextProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { palette as c, tokens } from "./tokens";
import { nominal, type ChannelId, type LinkState } from "../src/model";

export function Copy({ style, ...props }: TextProps) {
  return <Text allowFontScaling style={[s.body, style]} {...props} />;
}
export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={s.safe} edges={["left", "right"]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function NativeIcon({
  kind,
  color = c.accentAmber,
  size = 24,
}: {
  kind: "light" | "sun" | "shield" | "arrow" | "check";
  color?: string;
  size?: number;
}) {
  const paths = {
    light:
      "M9 18h6M9 21h6M8.1 14.5a6 6 0 1 1 7.8 0c-.9.7-1.4 1.4-1.4 2.5h-5c0-1.1-.5-1.8-1.4-2.5Z",
    sun: "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
    shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6ZM8 12l3 3 5-6",
    arrow: "M5 12h14M13 6l6 6-6 6",
    check: "M20 6 9 17l-5-5",
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d={paths[kind]}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {kind === "sun" && (
        <Circle
          cx={12}
          cy={12}
          r={4}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
        />
      )}
    </Svg>
  );
}
export function NativeButton({
  label,
  onPress,
  disabled = false,
  icon = "arrow",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: "arrow" | "check";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: "#00000018" }}
      style={({ pressed }) => [
        s.button,
        disabled && s.disabled,
        pressed && s.pressed,
      ]}
    >
      <Copy style={s.buttonText}>{label}</Copy>
      <NativeIcon kind={icon} color="#252623" size={20} />
    </Pressable>
  );
}
export function SourceLabel({ link }: { link: LinkState }) {
  return (
    <View style={s.source}>
      <Copy style={s.caption}>SPECWATT / ДЕМО</Copy>
      <Copy
        style={[
          s.caption,
          { color: link === "online" ? c.statusProtected : c.statusWarning },
        ]}
      >
        {link === "online"
          ? "Локальная модель"
          : link === "loading"
            ? "Ожидание данных"
            : link === "error"
              ? "Ошибка соединения"
              : "Нет соединения"}
      </Copy>
    </View>
  );
}
export function Surface({ children }: { children: ReactNode }) {
  return <View style={s.card}>{children}</View>;
}
export function NativePower({ watts }: { watts: number | null }) {
  return (
    <Surface>
      <Copy style={s.caption}>МОЩНОСТЬ СЕЙЧАС · ДЕМО</Copy>
      <View style={s.powerRow}>
        <View style={{ flex: 1 }}>
          <Copy style={s.metric}>
            {watts === null ? "—" : watts.toLocaleString("ru-RU")}
            <Copy style={s.unit}> Вт</Copy>
          </Copy>
          <Copy style={s.muted}>
            {watts === null
              ? "Нет актуальных данных"
              : `Резерв ${(Math.round((7 - watts) * 10) / 10).toLocaleString("ru-RU")} Вт`}
          </Copy>
        </View>
        <Svg
          width={106}
          height={106}
          viewBox="0 0 120 120"
          accessible
          accessibilityLabel={
            watts === null
              ? "Мощность неизвестна"
              : `${watts.toLocaleString("ru-RU")} Вт из 7 Вт`
          }
        >
          <Circle
            cx={60}
            cy={60}
            r={43}
            stroke="#ffffff14"
            strokeWidth={4}
            fill="none"
            strokeDasharray="205 70"
            transform="rotate(135 60 60)"
          />
          <Circle
            cx={60}
            cy={60}
            r={43}
            stroke={c.accentAmber}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${((watts ?? 0) / 7) * 205} 300`}
            transform="rotate(135 60 60)"
          />
          <Path
            d="m65 40-19 24h13l-5 17 20-25H61Z"
            stroke={c.accentAmber}
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>
      </View>
      <Copy style={s.caption}>ЛИМИТ 7 ВТ / CH3 ВСЕГДА ЗАЩИЩЁН</Copy>
    </Surface>
  );
}
export function NativeDeviceTile({
  id,
  on,
  link,
  onToggle,
  onOpen,
}: {
  id: "CH1" | "CH2";
  on: boolean;
  link: LinkState;
  onToggle: (id: ChannelId) => void;
  onOpen: () => void;
}) {
  const title = id === "CH1" ? "Светильник" : "LED-лента";
  return (
    <View style={[s.device, on && s.deviceOn]}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Открыть ${title}`}
        style={s.deviceHeading}
      >
        <NativeIcon
          kind={id === "CH1" ? "light" : "sun"}
          color={on ? c.accentAmber : c.textSecondary}
        />
        <Copy style={s.caption}>{id}</Copy>
      </Pressable>
      <Copy style={s.deviceTitle}>{title}</Copy>
      <Copy style={s.muted}>
        {id === "CH1" ? "Основной свет" : "Атмосферный свет"}
      </Copy>
      <View style={s.switchRow}>
        <Copy style={s.muted}>
          {link === "online" ? (on ? "Включено" : "Выключено") : "Нет связи"}
        </Copy>
        <View style={s.switchTouch}>
          <Switch
            accessibilityLabel={`${title}: питание`}
            disabled={link !== "online"}
            value={on}
            onValueChange={() => onToggle(id)}
            thumbColor={on ? "#fff0d8" : "#b7beb5"}
            trackColor={{ false: "#444a47", true: c.accentAmber }}
          />
        </View>
      </View>
      <Copy style={s.deviceWatts}>
        {link === "online"
          ? (on ? nominal[id] : 0).toLocaleString("ru-RU")
          : "—"}{" "}
        Вт
      </Copy>
    </View>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.surfaceCanvas },
  content: { padding: 23, gap: 18, paddingBottom: 32 },
  body: {
    fontFamily: "Manrope",
    fontSize: tokens.typography.body.fontSize,
    lineHeight: 22,
    color: c.textPrimary,
  },
  caption: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1,
    color: c.textSecondary,
  },
  muted: { fontSize: 11, lineHeight: 18, color: c.textSecondary },
  title: {
    fontSize: tokens.typography.heading.fontSize,
    lineHeight: 38,
    letterSpacing: -1,
    fontWeight: "500",
  },
  section: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ffffff14",
    backgroundColor: c.surfaceRaised,
    gap: 12,
  },
  source: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  powerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metric: {
    fontSize: tokens.typography.metric.fontSize,
    lineHeight: 70,
    letterSpacing: -3,
  },
  unit: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: c.textSecondary,
  },
  button: {
    minHeight: 56,
    backgroundColor: c.accentAmber,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    color: "#252623",
    flexShrink: 1,
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  device: {
    flexGrow: 1,
    flexBasis: 145,
    padding: 16,
    gap: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ffffff12",
    backgroundColor: "#24282a",
  },
  deviceOn: { backgroundColor: "#30312c", borderColor: "#edb17c30" },
  deviceHeading: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceTitle: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  switchTouch: {
    minHeight: 48,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceWatts: {
    fontSize: 16,
    lineHeight: 24,
    borderTopWidth: 1,
    borderTopColor: "#ffffff10",
    paddingTop: 8,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  subtleButton: {
    minHeight: 48,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff18",
    justifyContent: "center",
  },
  photo: { width: "100%", aspectRatio: 1.16, borderRadius: 26 },
  heroText: {
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -2,
    fontWeight: "400",
  },
  smallImage: { width: 76, height: 76, borderRadius: 16 },
  protected: {
    alignItems: "center",
    padding: 32,
    gap: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#b8c9b025",
    backgroundColor: "#232b25",
  },
});
