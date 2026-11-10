import React, { useState } from "react";
import { View, Pressable } from "react-native";
import {
  Copy,
  NativeDeviceTile,
  NativeButton,
  ScreenShell,
  SourceLabel,
  s,
} from "./components";
import type { NativeModel } from "./screens";
import { NativeRow } from "./controls";
export function NativeDevices(model: NativeModel) {
  const [filter, setFilter] = useState("Все");
  return (
    <ScreenShell>
      <SourceLabel link={model.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Ваши устройства
      </Copy>
      <Copy style={s.muted}>02 управляемых · 01 защищённый</Copy>
      <View style={s.grid}>
        {["Все", "Включены", "Защищённые"].map((f) => (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: f === filter }}
            onPress={() => setFilter(f)}
            style={s.subtleButton}
          >
            <Copy>{f}</Copy>
          </Pressable>
        ))}
      </View>
      {filter !== "Защищённые" &&
        (["CH1", "CH2"] as const)
          .filter((id) => filter === "Все" || model.channels[id])
          .map((id) => (
            <NativeDeviceTile
              key={id}
              id={id}
              on={model.channels[id]}
              link={model.link}
              onToggle={model.onToggle}
              onOpen={() =>
                model.onNavigate(id === "CH1" ? "device" : "lighting")
              }
            />
          ))}
      <NativeRow
        title="CH3 · постоянная защищённая нагрузка"
        detail={
          model.link === "online"
            ? "2,4 Вт · управление заблокировано"
            : "Нет актуальных данных · номинал 2,4 Вт"
        }
        onPress={() => model.onNavigate("protected")}
      />
      <NativeButton
        label="Подключение контроллера"
        onPress={() => model.onNavigate("setup")}
      />
    </ScreenShell>
  );
}
