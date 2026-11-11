import React, { useState } from "react";
import {
  Image,
  ScrollView,
  useWindowDimensions,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";
import Svg, {
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { NativeToggle, NativeRow } from "./controls";
import { NativeSceneSlider } from "./SceneSlider";
import {
  NativeHeader,
  Copy,
  NativeButton,
  NativeDeviceTile,
  NativeIcon,
  NativePower,
  ScreenShell,
  SourceLabel,
  Surface,
  s,
} from "./components";
import { palette as c } from "./tokens";
import {
  totalWatts,
  type ChannelState,
  type LinkState,
  type ChannelId,
} from "../src/model";
import {
  chartScale,
  data,
  shares,
  totals,
  type Period,
} from "../src/lib/demo-energy";
import type { Page } from "../src/types";

export type NativeRoute = Page;
export type NativeModel = {
  assets: SceneAssets;
  channels: ChannelState;
  link: LinkState;
  onToggle: (id: ChannelId) => void;
  onNavigate: (route: NativeRoute) => void;
};
// Inject bundled require(...) sources from the host Expo project; no remote image permissions.
export type SceneAssets = {
  welcome: ImageSourcePropType;
  lighting: ImageSourcePropType;
  pendantOn: ImageSourcePropType;
  pendantOff: ImageSourcePropType;
};

export function NativeWelcome({
  assets,
  onNavigate,
}: {
  assets: SceneAssets;
  onNavigate: NativeModel["onNavigate"];
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "#17191a" }}>
      <Image
        source={assets.welcome}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
        accessibilityLabel="Архитектурный холл с тёплым светом"
      />
      <Svg
        width="100%"
        height="100%"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="welcome-shade" x2="0" y2="1">
            <Stop stopColor="#101313" stopOpacity={0} />
            <Stop offset=".5" stopColor="#101313" stopOpacity={0.15} />
            <Stop offset="1" stopColor="#101313" stopOpacity={0.95} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#welcome-shade)" />
      </Svg>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent: "space-between",
          gap: 84,
        }}
      >
        <View style={{ gap: 20, paddingTop: 16 }}>
          <Copy style={{ fontSize: 26, fontWeight: "700", lineHeight: 34 }}>
            specwatt.
          </Copy>
          <Copy style={s.caption}>EXPERIENCE / 04.1</Copy>
        </View>
        <View style={{ gap: 22 }}>
          <Copy style={[s.caption, { color: c.accentAmber }]}>
            ТЕХНОЛОГИЯ СПОКОЙНОЙ ЖИЗНИ
          </Copy>
          <Copy
            accessibilityRole="header"
            style={[s.heroText, { fontSize: 48, lineHeight: 56 }]}
          >
            Энергия.{"\n"}
            <Copy
              style={[
                s.heroText,
                { color: c.accentAmber, fontSize: 48, lineHeight: 56 },
              ]}
            >
              В вашем ритме.
            </Copy>
          </Copy>
          <Copy style={{ fontSize: 14, lineHeight: 23 }}>
            Красивый свет. Понятная энергия.{"\n"}Всё под вашим контролем.
          </Copy>
          <NativeButton
            label="Открыть SpecWATT"
            onPress={() => onNavigate("home")}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => onNavigate("setup")}
            style={{
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Copy>Как подключить контроллер</Copy>
          </Pressable>
          <Copy style={s.caption}>СОЗДАНО ДЛЯ ОСОЗНАННОЙ ЭНЕРГИИ · ДЕМО</Copy>
        </View>
      </ScrollView>
    </View>
  );
}
export function NativeHome(model: NativeModel) {
  const { fontScale } = useWindowDimensions();
  return (
    <ScreenShell compact>
      <NativeHeader title="Добрый вечер." home />
      <SourceLabel link={model.link} />
      <NativePower
        watts={model.link === "online" ? totalWatts(model.channels) : null}
        channels={model.channels}
      />
      <View style={[s.source, { alignItems: "center" }]}>
        <Copy style={s.section}>Под вашим контролем</Copy>
        <Pressable
          accessibilityRole="button"
          onPress={() => model.onNavigate("devices")}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Copy style={s.muted}>Все устройства ›</Copy>
        </Pressable>
      </View>
      <View style={[s.grid, fontScale > 1.2 && { flexDirection: "column" }]}>
        {(["CH1", "CH2"] as const).map((id) => (
          <NativeDeviceTile
            key={id}
            layout={fontScale > 1.2 ? "row" : "tile"}
            id={id}
            assets={model.assets}
            on={model.channels[id]}
            link={model.link}
            onToggle={model.onToggle}
            onOpen={() =>
              model.onNavigate(id === "CH1" ? "device" : "lighting")
            }
          />
        ))}
      </View>
      <View style={s.grid}>
        {(["planner", "autopilot"] as const).map((route) => (
          <Pressable
            style={[s.subtleButton, { flexGrow: 1 }]}
            accessibilityRole="button"
            key={route}
            onPress={() => model.onNavigate(route)}
          >
            <Copy>{route === "planner" ? "План нагрузки" : "Автопилот"}</Copy>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Управлять освещением"
        onPress={() => model.onNavigate("lighting")}
        style={[s.card, { padding: 16, backgroundColor: "#30302b", gap: 4 }]}
      >
        <Copy style={[s.caption, { color: c.accentAmber, fontSize: 9 }]}>
          CH2 / СВЕТОВАЯ СЦЕНА
        </Copy>
        <Copy style={[s.section, { fontSize: 22, lineHeight: 30 }]}>
          Свет вдоль стены.
        </Copy>
        <Svg width="100%" height={50} viewBox="0 0 347 60" accessible={false}>
          <Path d="m30 58 290-47 20 5L50 64Z" fill="#d19560" />
          <Path d="m30 57 290-47 15 4L45 61Z" fill="#ffe3bb" />
        </Svg>
        <Copy style={s.muted}>Управлять освещением ↗</Copy>
      </Pressable>
      <Copy style={[s.caption, { fontSize: 9, letterSpacing: 0 }]}>
        Локальная модель · не измерение оборудования
      </Copy>

      <Pressable
        accessibilityRole="button"
        style={s.subtleButton}
        onPress={() => model.onNavigate("protected")}
      >
        <Copy style={{ color: c.statusProtected }}>
          CH3 под защитой · всегда вне автоматизации
        </Copy>
      </Pressable>
    </ScreenShell>
  );
}
export function NativeLighting({
  assets,
  ...model
}: NativeModel & { assets: SceneAssets }) {
  const [brightness, setBrightness] = useState(70);
  return (
    <ScreenShell>
      <NativeHeader
        title="Атмосферный свет"
        subtitle="LED-лента · CH2"
        back
        compact
      />
      <View style={local.scene}>
        <Image
          source={assets.lighting}
          resizeMode="cover"
          style={[
            StyleSheet.absoluteFill,
            {
              width: "100%",
              height: "100%",
              opacity: model.channels.CH2
                ? 0.35 + (brightness / 100) * 0.65
                : 0.35,
            },
          ]}
          accessibilityLabel="Спальня с архитектурным освещением"
        />
        <View style={local.sceneShade}>
          <Copy style={{ fontSize: 27, lineHeight: 34, letterSpacing: -1 }}>
            Оставьте день{"\n"}за порогом.
          </Copy>
        </View>
      </View>
      <Surface>
        <NativeToggle
          label="LED-лента: питание"
          detail={
            model.link !== "online"
              ? "Состояние не подтверждено"
              : model.channels.CH2
                ? "Включено · 4,2 Вт"
                : "Выключено · 0 Вт"
          }
          value={model.channels.CH2}
          disabled={model.link !== "online"}
          onChange={() => model.onToggle("CH2")}
        />
      </Surface>
      <View style={s.source}>
        <Copy style={s.section}>Световая сцена</Copy>
        <Copy style={{ fontSize: 28, lineHeight: 36, color: c.accentAmber }}>
          {brightness}%
        </Copy>
      </View>
      <NativeSceneSlider value={brightness} onChange={setBrightness} />
      <View style={s.grid}>
        {[
          { title: "Тихий вечер", value: 35 },
          { title: "Мой свет", value: 70 },
          { title: "Яркий акцент", value: 100 },
        ].map((p) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: brightness === p.value }}
            key={p.value}
            style={[
              s.subtleButton,
              {
                flexGrow: 1,
                borderColor:
                  brightness === p.value ? c.accentAmber : "#ffffff18",
              },
            ]}
            onPress={() => setBrightness(p.value)}
          >
            <Copy style={{ fontSize: 11, textAlign: "center" }}>{p.title}</Copy>
          </Pressable>
        ))}
      </View>
      <Copy style={s.muted}>
        Концепция сцены. Аппаратное диммирование не подтверждено; яркость
        изменяет только изображение.
      </Copy>
      <NativeRow
        title="Добавить расписание"
        onPress={() => model.onNavigate("planner")}
      />
    </ScreenShell>
  );
}
export function NativeEnergy({
  onNavigate,
}: {
  onNavigate: NativeModel["onNavigate"];
}) {
  const [period, setPeriod] = useState<Period>("Неделя");
  const [selected, setSelected] = useState(6);
  const values = data[period],
    index = Math.min(selected, values.length - 1),
    scale = chartScale(period);
  const x = (i: number) => 44 + ((i + 0.5) / values.length) * 280;
  return (
    <ScreenShell>
      <NativeHeader
        title="Энергия в деталях"
        subtitle="Учебный профиль · демо"
      />
      <View
        style={[
          s.grid,
          {
            gap: 2,
            padding: 3,
            borderWidth: 1,
            borderColor: "#ffffff14",
            borderRadius: 18,
          },
        ]}
      >
        {(["День", "Неделя", "Месяц"] as Period[]).map((p) => (
          <Pressable
            key={p}
            accessibilityRole="button"
            accessibilityState={{ selected: p === period }}
            onPress={() => {
              setPeriod(p);
              setSelected(data[p].length - 1);
            }}
            style={[
              s.subtleButton,
              {
                flex: 1,
                backgroundColor: p === period ? c.accentAmber : c.surfaceInset,
              },
            ]}
          >
            <Copy
              style={{
                textAlign: "center",
                color: p === period ? "#252623" : c.textPrimary,
              }}
            >
              {p}
            </Copy>
          </Pressable>
        ))}
      </View>
      <View style={{ gap: 2, paddingVertical: 8 }}>
        <Copy style={s.caption}>ОБЩЕЕ ПОТРЕБЛЕНИЕ</Copy>
        <Copy style={s.metric}>
          {totals[period].toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
          <Copy style={s.unit}> кВт·ч</Copy>
        </Copy>
      </View>
      <Surface>
        <Copy style={s.section}>
          {period === "День"
            ? "Средняя мощность по часам"
            : "Энергия по интервалам"}
        </Copy>
        <Svg
          viewBox="0 0 336 216"
          fontFamily="Manrope"
          width="100%"
          height={216}
          accessible
          accessibilityLabel={`Демо-график за ${period}. ${period === "День" ? "Вт" : "кВт·ч"}`}
        >
          {scale.ticks.map((t) => (
            <React.Fragment key={t}>
              <Path
                d={`M44 ${scale.y(t)}H324`}
                stroke="#ffffff18"
                strokeDasharray="2 4"
              />
              <SvgText
                x={34}
                y={scale.y(t) + 4}
                textAnchor="end"
                fill="#b9bcb5"
                fontSize={11}
              >
                {t.toLocaleString("ru-RU")}
              </SvgText>
            </React.Fragment>
          ))}
          {values.map((v, i) => (
            <Rect
              key={i}
              x={x(i) - Math.max(3, (280 / values.length) * 0.3)}
              y={scale.y(v)}
              width={Math.max(6, (280 / values.length) * 0.6)}
              height={184 - scale.y(v)}
              rx={2}
              fill={i === index ? "#f5bf8c" : "#9d8d79"}
              onPress={() => setSelected(i)}
            />
          ))}
          <Circle
            cx={x(index)}
            cy={scale.y(values[index])}
            r={4}
            fill="#fff0d8"
          />
          {(period === "День"
            ? [0, 6, 12, 18, 23]
            : values.map((_, i) => i)
          ).map((i) => (
            <SvgText
              key={i}
              x={x(i)}
              y={207}
              textAnchor="middle"
              fill="#b9bcb5"
              fontSize={11}
            >
              {period === "День"
                ? String(i).padStart(2, "0")
                : period === "Неделя"
                  ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]
                  : ["1–7", "8–14", "15–21", "22–30"][i]}
            </SvgText>
          ))}
        </Svg>
        <View style={s.source}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Предыдущий интервал"
            disabled={index === 0}
            style={[s.iconButton, index === 0 && s.disabled]}
            onPress={() => setSelected(index - 1)}
          >
            <NativeIcon kind="back" size={18} />
          </Pressable>
          <Copy
            accessibilityLiveRegion="polite"
            style={{ color: c.accentAmber, flexShrink: 1 }}
          >
            Интервал {index + 1}
            {"\n"}
            {values[index].toLocaleString("ru-RU")}{" "}
            {period === "День" ? "Вт" : "кВт·ч"}
          </Copy>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Следующий интервал"
            disabled={index === values.length - 1}
            style={[s.iconButton, index === values.length - 1 && s.disabled]}
            onPress={() => setSelected(index + 1)}
          >
            <NativeIcon kind="arrow" size={18} />
          </Pressable>
        </View>
      </Surface>
      <Copy style={s.section}>Куда уходит энергия</Copy>
      {(["CH3", "CH2", "CH1"] as const).map((id) => (
        <Pressable
          key={id}
          accessibilityRole="button"
          style={s.row}
          onPress={() =>
            onNavigate(
              id === "CH3" ? "protected" : id === "CH2" ? "lighting" : "device",
            )
          }
        >
          <View style={s.source}>
            <Copy>
              {id === "CH3"
                ? "Защищённый канал"
                : id === "CH2"
                  ? "LED-лента"
                  : "Светильник"}
            </Copy>
            <Copy style={{ color: c.accentAmber }}>{shares[period][id]}%</Copy>
          </View>
          <View
            style={{ height: 3, backgroundColor: "#ffffff12", marginTop: 10 }}
          >
            <View
              style={{
                width: `${shares[period][id]}%`,
                height: 3,
                backgroundColor:
                  id === "CH3" ? c.statusProtected : c.accentAmber,
              }}
            />
          </View>
        </Pressable>
      ))}
      <Copy style={s.muted}>
        Учебный профиль, не телеметрия стенда. Стоимость и экономия не
        рассчитываются.
      </Copy>
    </ScreenShell>
  );
}
export function NativeProtected({
  link,
  onNavigate,
}: {
  link: LinkState;
  onNavigate: NativeModel["onNavigate"];
}) {
  return (
    <ScreenShell>
      <NativeHeader
        title="Под защитой"
        subtitle="CH3 · вне автоматизации"
        back
      />
      <View
        style={[
          s.protected,
          { alignItems: "stretch", padding: 24, borderRadius: 22 },
        ]}
      >
        <View style={s.source}>
          <Copy style={{ fontSize: 56, lineHeight: 68, letterSpacing: -3 }}>
            CH3
          </Copy>
          <NativeIcon kind="shield" size={38} color={c.statusProtected} />
        </View>
        <Copy style={s.caption}>ПОСТОЯННАЯ ЗАЩИТА В МОДЕЛИ</Copy>
        <Copy style={[s.title, { fontSize: 27, fontWeight: "400" }]}>
          Вне управления.{"\n"}Внутри энергобаланса.
        </Copy>
        <Copy style={s.muted}>
          Номинальная нагрузка канала учитывается перед каждым действием CH1 и
          CH2.
        </Copy>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#ffffff14",
          paddingVertical: 20,
          gap: 8,
        }}
      >
        <Copy style={s.caption}>ТЕКУЩАЯ МОЩНОСТЬ · ДЕМО</Copy>
        <Copy style={[s.metric, { fontSize: 42 }]}>
          {link === "online" ? "2,4" : "—"}
          <Copy style={s.unit}> Вт</Copy>
        </Copy>
      </View>
      <View style={{ gap: 16 }}>
        <View style={s.source}>
          <View>
            <Copy style={s.muted}>Базовая нагрузка</Copy>
            <Copy style={{ fontSize: 24, lineHeight: 36 }}>2,4 Вт</Copy>
          </View>
          <View>
            <Copy style={s.muted}>Лимит стенда</Copy>
            <Copy style={{ fontSize: 24, lineHeight: 36 }}>7 Вт</Copy>
          </View>
        </View>
        <View
          style={{
            height: 10,
            backgroundColor: "#373e37",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 10,
              width: "34.2857%",
              backgroundColor: c.statusProtected,
            }}
          />
        </View>
        <Copy style={s.muted}>
          CH3 занимает 34% лимита · расчёт по номиналу
        </Copy>
      </View>
      <Copy style={s.section}>Нет удалённого переключения</Copy>
      <Copy style={s.muted}>Через приложение и автоматизацию</Copy>
      <Copy style={s.section}>Не входит в расписания</Copy>
      <Copy style={s.muted}>Правила CH1 / CH2 не затрагивают CH3</Copy>
      <Copy style={s.muted}>
        Защита реализована в модели симулятора. Аппаратная схема ESP32 требует
        отдельной проверки.
      </Copy>
      <NativeRow
        title="Вернуться к устройствам"
        onPress={() => onNavigate("devices")}
      />
    </ScreenShell>
  );
}
const local = StyleSheet.create({
  welcomePhoto: { height: 300, overflow: "hidden", borderRadius: 28 },
  welcomeBrand: { padding: 22, gap: 8, backgroundColor: "#17191a35" },
  scene: { aspectRatio: 1.15, borderRadius: 27, overflow: "hidden" },
  sceneShade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#17191a65",
    padding: 22,
  },
});
