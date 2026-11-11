import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Linking,
  StatusBar,
  Pressable,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Copy, NativeIcon, s } from "./components";
import {
  NativeWelcome,
  NativeHome,
  NativeLighting,
  NativeEnergy,
  NativeProtected,
  type SceneAssets,
  type NativeRoute,
} from "./screens";
import { NativeDevices } from "./Devices";
import { NativeDeviceDetail } from "./DeviceDetail";
import { NativeAutopilot } from "./Autopilot";
import { NativePlanner } from "./Planner";
import { NativeJournal } from "./Journal";
import { NativeSetup } from "./Setup";
import { NativeSettings } from "./Settings";
import { useNativeDemo } from "./useNativeDemo";
import { palette as c, tokens } from "./tokens";
import { pageLabels } from "../src/lib/design";
/** Isolated UI host. No network transport, device registration or background execution. */
export function NativeExperience({
  assets,
  initialRoute = "welcome",
}: {
  assets: SceneAssets;
  initialRoute?: NativeRoute;
}) {
  const [route, setRoute] = useState<NativeRoute>(initialRoute),
    [notice, setNotice] = useState(""),
    [setupStep, setSetupStep] = useState(1),
    [systemReduced, setSystemReduced] = useState(true);
  const runtime = useNativeDemo(setNotice);
  const history = useRef<NativeRoute[]>([]);
  const opacity = useRef(new Animated.Value(1)).current;
  function go(next: NativeRoute) {
    history.current.push(route);
    setRoute(next);
    setNotice("");
  }
  function back() {
    const next = history.current.pop();
    if (!next) return false;
    setRoute(next);
    setNotice("");
    return true;
  }
  useEffect(() => {
    let active = true;
    function open(url: string | null | undefined) {
      if (!active || !url) return;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "specwatt-experience-v41:") return;
        const target = parsed.hostname || parsed.pathname.replace(/^\//, "");
        if (!Object.hasOwn(pageLabels, target)) return;
        history.current = [];
        setNotice("");
        setSetupStep(
          Math.max(
            1,
            Math.min(3, Number(parsed.searchParams.get("step")) || 1),
          ),
        );
        setRoute(target as NativeRoute);
      } catch {
        /* Ignore malformed navigation links. */
      }
    }
    Linking.getInitialURL().then(open);
    const subscription = Linking.addEventListener("url", (event) =>
      open(event.url),
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setSystemReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduced,
    );
    return () => {
      active = false;
      sub.remove();
    };
  }, []);
  useEffect(() => {
    if (route === "setup") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", back);
    return () => sub.remove();
  }, [route]);
  useEffect(() => {
    opacity.stopAnimation();
    if (runtime.reduceMotion || systemReduced) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0.6);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: tokens.motion.screen.$value.value,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [route, runtime.reduceMotion, systemReduced, opacity]);
  const m = {
    ...runtime,
    assets,
    reduceMotion: runtime.reduceMotion || systemReduced,
    onNavigate: go,
  };
  const views = {
    welcome: <NativeWelcome assets={assets} onNavigate={go} />,
    home: <NativeHome {...m} />,
    lighting: <NativeLighting {...m} assets={assets} />,
    energy: <NativeEnergy onNavigate={go} />,
    devices: <NativeDevices {...m} />,
    device: <NativeDeviceDetail {...m} />,
    protected: <NativeProtected link={m.link} onNavigate={go} />,
    autopilot: <NativeAutopilot {...m} />,
    planner: <NativePlanner {...m} />,
    journal: <NativeJournal {...m} />,
    setup: (
      <NativeSetup key={setupStep} initialStep={setupStep} onNavigate={go} />
    ),
    settings: <NativeSettings {...m} />,
  };
  const active = ["device", "lighting", "protected"].includes(route)
    ? "devices"
    : ["planner"].includes(route)
      ? "autopilot"
      : route;
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: c.surfaceCanvas }}
        edges={["top", "bottom"]}
      >
        <StatusBar barStyle="light-content" />
        {route !== "welcome" && route !== "setup" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 4,
              gap: 10,
            }}
          >
            {[
              "lighting",
              "device",
              "protected",
              "planner",
              "journal",
              "settings",
            ].includes(route) ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Назад"
                onPress={back}
                style={s.iconButton}
              >
                <NativeIcon kind="back" color={c.textPrimary} />
              </Pressable>
            ) : null}
            <View style={{ flex: 1 }} />
            <Pressable
              accessibilityRole="button"
              onPress={() => go("journal")}
              accessibilityLabel="Журнал событий"
              style={s.iconButton}
            >
              <NativeIcon kind="bell" color={c.textSecondary} size={21} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => go("settings")}
              accessibilityLabel="Настройки"
              style={s.iconButton}
            >
              <NativeIcon kind="settings" color={c.textSecondary} size={21} />
            </Pressable>
          </View>
        )}
        <Animated.View style={{ flex: 1, opacity }} key={route}>
          {views[route]}
        </Animated.View>
        {notice && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${notice} Нажмите, чтобы закрыть уведомление`}
            accessibilityLiveRegion="polite"
            onPress={() => setNotice("")}
            style={{ padding: 16, backgroundColor: "#36312a" }}
          >
            <Copy>{notice}</Copy>
          </Pressable>
        )}
        {route !== "welcome" && route !== "setup" && (
          <View>
            <View
              style={{
                flexDirection: "row",
                padding: 8,
                marginHorizontal: 14,
                marginVertical: 8,
                borderWidth: 1,
                borderRadius: 24,
                backgroundColor: "#262b2c",
                borderColor: "#ffffff18",
              }}
            >
              {(["home", "devices", "energy", "autopilot"] as const).map(
                (r, i) => (
                  <Pressable
                    key={r}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active === r }}
                    style={{
                      flex: 1,
                      minHeight: 56,
                      gap: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => go(r)}
                  >
                    <NativeIcon
                      kind={(["home", "grid", "energy", "auto"] as const)[i]}
                      color={active === r ? c.accentAmber : c.textSecondary}
                      size={23}
                    />
                    <Copy
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                      style={{
                        fontSize: 11,
                        color: active === r ? c.accentAmber : c.textSecondary,
                      }}
                    >
                      {["Главная", "Устройства", "Энергия", "Авто"][i]}
                    </Copy>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
