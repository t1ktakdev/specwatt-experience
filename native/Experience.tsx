import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Pressable,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Copy, s } from "./components";
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
    const sub = BackHandler.addEventListener("hardwareBackPress", back);
    return () => sub.remove();
  }, []);
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
    setup: <NativeSetup onNavigate={go} />,
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
        {route !== "welcome" && route !== "setup" && (
          <View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Назад"
                onPress={back}
                style={s.subtleButton}
              >
                <Copy>← Назад</Copy>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => go("journal")}
                style={s.subtleButton}
              >
                <Copy>Журнал</Copy>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => go("settings")}
                style={s.subtleButton}
              >
                <Copy>Настройки</Copy>
              </Pressable>
            </View>
          </View>
        )}
        <Animated.View style={{ flex: 1, opacity }} key={route}>
          {views[route]}
        </Animated.View>
        {notice && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Закрыть уведомление"
            onPress={() => setNotice("")}
            style={{ padding: 16, backgroundColor: "#36312a" }}
          >
            <Copy accessibilityLiveRegion="polite">{notice}</Copy>
          </Pressable>
        )}
        {route !== "welcome" && route !== "setup" && (
          <View>
            <View
              style={{
                flexDirection: "row",
                padding: 8,
                borderTopWidth: 1,
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
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => go(r)}
                  >
                    <Copy
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
