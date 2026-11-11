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
import {
  nominal,
  type ChannelId,
  type LinkState,
  type ChannelState,
} from "../src/model";
import { NativeProduct } from "./Product";
import type { SceneAssets } from "./screens";

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
  kind:
    | "light"
    | "sun"
    | "shield"
    | "arrow"
    | "check"
    | "home"
    | "grid"
    | "energy"
    | "auto"
    | "back"
    | "settings"
    | "bell";
  color?: string;
  size?: number;
}) {
  const paths = {
    home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
    grid: "M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z",
    energy: "M4 20v-6M9 20v-9M14 20v-5M19 20V8M3 10l6-5 5 4 6-6",
    auto: "m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6ZM20 2v4M18 4h4",
    back: "M19 12H5m6-6-6 6 6 6",
    settings: "M4 7h7M15 7h5M4 17h5M13 17h7M11 4v6M9 14v6",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
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
export function NativePower({
  watts,
  channels,
}: {
  watts: number | null;
  channels?: ChannelState;
}) {
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
      {channels && (
        <View
          style={{
            gap: 14,
            borderTopWidth: 1,
            borderColor: "#ffffff12",
            paddingTop: 16,
          }}
        >
          <View style={s.source}>
            <Copy style={s.muted}>Баланс нагрузки</Copy>
            <Copy style={s.muted}>Лимит 7 Вт</Copy>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: "#ffffff0a",
              borderRadius: 3,
              overflow: "hidden",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <View
              style={{
                width: "34.2857%",
                backgroundColor: c.statusProtected,
                opacity: watts === null ? 0.35 : 1,
              }}
            />
            {watts !== null && channels.CH1 && (
              <View style={{ width: "25.7143%", backgroundColor: "#a08c76" }} />
            )}
            {watts !== null && channels.CH2 && (
              <View style={{ width: "60%", backgroundColor: c.accentAmber }} />
            )}
          </View>
          <View style={s.source}>
            {(["CH3", "CH1", "CH2"] as const).map((id) => (
              <View key={id}>
                <Copy style={s.caption}>
                  {id}
                  {id === "CH3" ? " · защита" : ""}
                </Copy>
                <Copy style={{ fontSize: 16 }}>
                  {watts === null
                    ? "—"
                    : (channels[id] ? nominal[id] : 0).toLocaleString(
                        "ru-RU",
                      )}{" "}
                  Вт
                </Copy>
              </View>
            ))}
          </View>
        </View>
      )}
      <Copy style={s.caption}>ЛОКАЛЬНАЯ МОДЕЛЬ · НЕ ИЗМЕРЕНИЕ</Copy>
    </Surface>
  );
}
export function NativeDeviceTile({
  id,
  on,
  link,
  onToggle,
  onOpen,
  assets,
  layout = "tile",
}: {
  id: "CH1" | "CH2";
  on: boolean;
  link: LinkState;
  onToggle: (id: ChannelId) => void;
  onOpen: () => void;
  assets: SceneAssets;
  layout?: "tile" | "row";
}) {
  const title = id === "CH1" ? "Светильник" : "LED-лента";
  if (layout === "row")
    return (
      <View
        style={[
          s.device,
          { flexDirection: "row", flexBasis: "auto", gap: 14 },
          on && s.deviceOn,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Открыть ${title}`}
          onPress={onOpen}
          style={{ width: 96, justifyContent: "center" }}
        >
          <Copy style={s.caption}>{id}</Copy>
          <NativeProduct
            id={id}
            on={on}
            known={link === "online"}
            assets={assets}
          />
        </Pressable>
        <View style={{ flex: 1, gap: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Открыть ${title}`}
            onPress={onOpen}
            style={{ minHeight: 48, justifyContent: "center" }}
          >
            <Copy style={s.deviceTitle}>{title}</Copy>
          </Pressable>
          <Copy style={s.muted}>
            {id === "CH1" ? "Основной свет" : "Атмосферный свет"}
          </Copy>
          <View style={s.switchRow}>
            <Copy style={s.muted}>
              {link === "online"
                ? (on ? nominal[id] : 0).toLocaleString("ru-RU") + " Вт"
                : "— Вт"}
            </Copy>
            <Switch
              accessibilityLabel={`${title}: питание`}
              disabled={link !== "online"}
              value={on}
              onValueChange={() => onToggle(id)}
              thumbColor={on ? "#fff0d8" : "#b7beb5"}
              trackColor={{ false: "#444a47", true: c.accentAmber }}
              style={s.switchTouch}
            />
          </View>
        </View>
      </View>
    );
  return (
    <View style={[s.device, on && s.deviceOn]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Открыть ${title}`}
        onPress={onOpen}
      >
        <NativeProduct
          id={id}
          on={on}
          known={link === "online"}
          assets={assets}
        />
      </Pressable>
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
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
    color: c.textSecondary,
  },
  muted: { fontSize: 13, lineHeight: 21, color: c.textSecondary },
  title: {
    fontSize: tokens.typography.heading.fontSize,
    lineHeight: 38,
    letterSpacing: -1,
    fontWeight: "500",
  },
  section: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffff14",
    backgroundColor: "#282d2d",
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
  row: {
    minHeight: 72,
    paddingVertical: 14,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff12",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ffffff14",
    alignItems: "center",
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
