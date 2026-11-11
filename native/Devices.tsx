import React, { useState } from "react";
import { View, Pressable } from "react-native";
import {
  NativeHeader,
  Copy,
  NativeDeviceTile,
  NativeIcon,
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
      <NativeHeader title="Ваши устройства" journal />
      <Copy style={s.muted}>02 управляемых · 01 защищённый</Copy>
      <View style={s.grid}>
        {["Все", "Включены", "Защищённые"].map((f) => (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: f === filter }}
            onPress={() => setFilter(f)}
            style={[
              s.subtleButton,
              {
                backgroundColor: f === filter ? "#3b352e" : "transparent",
                borderColor: f === filter ? "#edb17c66" : "#ffffff18",
              },
            ]}
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
              layout="row"
              assets={model.assets}
              on={model.channels[id]}
              link={model.link}
              onToggle={model.onToggle}
              onOpen={() =>
                model.onNavigate(id === "CH1" ? "device" : "lighting")
              }
            />
          ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="CH3 · постоянная защищённая нагрузка"
        onPress={() => model.onNavigate("protected")}
        style={[
          s.card,
          {
            backgroundColor: "#232c27",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          },
        ]}
      >
        <NativeIcon kind="shield" size={28} color="#b8c9b0" />
        <View style={{ flex: 1, gap: 4 }}>
          <Copy style={s.caption}>CH3 / ЗАЩИЩЁННЫЙ</Copy>
          <Copy style={s.section}>Постоянная защищённая нагрузка</Copy>
          <Copy style={s.muted}>
            {model.link === "online"
              ? "2,4 Вт · управление заблокировано"
              : "Нет актуальных данных · номинал 2,4 Вт"}
          </Copy>
        </View>
        <NativeIcon kind="arrow" size={16} color="#b8c9b0" />
      </Pressable>
      <NativeRow
        title="Подключение контроллера"
        detail="Просмотреть процесс настройки"
        onPress={() => model.onNavigate("setup")}
      />
    </ScreenShell>
  );
}
