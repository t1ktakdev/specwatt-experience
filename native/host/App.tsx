import React from "react";
import { Text, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import { useFonts } from "expo-font";
import { NativeExperience } from "../Experience";
export default function App() {
  const [loaded, error] = useFonts({
    Manrope: require("./assets/Manrope.ttf"),
  });
  if (!loaded)
    return (
      <View style={{ flex: 1, backgroundColor: "#17191a", padding: 24 }}>
        <Text style={{ color: "#f4f1ea" }}>
          {error ? "Не удалось загрузить шрифт" : "Загрузка интерфейса…"}
        </Text>
      </View>
    );
  return (
    <>
      {/* SDK 58.0.4 maps light to light buttons; the installed native implementation is authoritative. */}
      <NavigationBar style="light" />
      <NativeExperience
        assets={{
          welcome: require("../../public/assets/welcome-architecture.webp"),
          lighting: require("../../public/assets/lighting-bedroom.webp"),
          pendantOn: require("../../public/assets/pendant-concept-on.webp"),
          pendantOff: require("../../public/assets/pendant-concept-off.webp"),
        }}
      />
    </>
  );
}
