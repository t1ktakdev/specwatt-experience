import React, { useRef, useState } from "react";
import { View, type GestureResponderEvent } from "react-native";
export function NativeSceneSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [width, setWidth] = useState(1);
  const gesture = useRef({ x: 0, y: 0, horizontal: false, cancelled: false });
  const choose = (e: GestureResponderEvent) =>
    onChange(
      Math.max(
        10,
        Math.min(100, Math.round(10 + (e.nativeEvent.locationX / width) * 90)),
      ),
    );
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Яркость концептуальной сцены"
      accessibilityValue={{
        min: 10,
        max: 100,
        now: value,
        text: `${value}% · только изображение`,
      }}
      accessibilityActions={[
        { name: "increment", label: "Ярче" },
        { name: "decrement", label: "Темнее" },
      ]}
      onAccessibilityAction={(e) =>
        onChange(
          Math.max(
            10,
            Math.min(
              100,
              value + (e.nativeEvent.actionName === "increment" ? 5 : -5),
            ),
          ),
        )
      }
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onResponderGrant={(e) => {
        gesture.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
          horizontal: false,
          cancelled: false,
        };
      }}
      onResponderMove={(e) => {
        const current = gesture.current;
        const dx = Math.abs(e.nativeEvent.pageX - current.x);
        const dy = Math.abs(e.nativeEvent.pageY - current.y);
        if (!current.horizontal && dy > 6 && dy > dx) current.cancelled = true;
        if (!current.cancelled && dx > 6 && dx > dy) {
          current.horizontal = true;
          choose(e);
        }
      }}
      onResponderRelease={(e) => {
        if (!gesture.current.cancelled) choose(e);
      }}
      onResponderTerminationRequest={() => !gesture.current.horizontal}
      onResponderTerminate={() => {
        gesture.current.cancelled = true;
      }}
      style={{ height: 48, justifyContent: "center" }}
    >
      <View
        pointerEvents="none"
        style={{ height: 5, backgroundColor: "#3a4039", borderRadius: 3 }}
      >
        <View
          style={{
            height: 5,
            width: `${((value - 10) / 90) * 100}%`,
            backgroundColor: "#edb17c",
            borderRadius: 3,
          }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: "#f4ead4",
          left: `${((value - 10) / 90) * 94}%`,
        }}
      />
    </View>
  );
}
