import React from "react";
import { Image, View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import type { SceneAssets } from "./screens";
export function NativeProduct({
  id,
  on,
  known,
  assets,
  height = 120,
}: {
  id: "CH1" | "CH2";
  on: boolean;
  known: boolean;
  assets: SceneAssets;
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        backgroundColor: "#202425",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {id === "CH1" ? (
        <Image
          source={known && on ? assets.pendantOn : assets.pendantOff}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
          accessibilityLabel="Концептуальный дисковый светильник CH1"
        />
      ) : (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 300 150"
          accessibilityLabel="Концептуальный алюминиевый LED-профиль CH2"
        >
          <Defs>
            <LinearGradient id="led-metal" x2="0" y2="1">
              <Stop stopColor="#777a79" />
              <Stop offset=".3" stopColor="#343a3a" />
              <Stop offset="1" stopColor="#14191a" />
            </LinearGradient>
          </Defs>
          <Path d="m27 105 230-65 22 13-230 70Z" fill="#0f1314" />
          <Path
            d="m27 96 230-65 22 13-230 70Z"
            fill="url(#led-metal)"
            stroke="#8f9290"
            strokeWidth={0.5}
          />
          <Path
            d="m32 98 225-63 15 9L47 108Z"
            fill={known && on ? "#ffe0b1" : "#999c92"}
          />
          <Path d="m27 96 22 18v9l-22-12Z" fill="#343b3c" />
          <Path d="m49 114 230-70v9L49 123Z" fill="#242b2c" />
        </Svg>
      )}
    </View>
  );
}
