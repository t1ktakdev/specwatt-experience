import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";
import {
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
  channels: ChannelState;
  link: LinkState;
  onToggle: (id: ChannelId) => void;
  onNavigate: (route: NativeRoute) => void;
};
// Inject bundled require(...) sources from the host Expo project; no remote image permissions.
export type SceneAssets = {
  welcome: ImageSourcePropType;
  lighting: ImageSourcePropType;
};

export function NativeWelcome({
  assets,
  onNavigate,
}: {
  assets: SceneAssets;
  onNavigate: NativeModel["onNavigate"];
}) {
  return (
    <ScreenShell>
      <View style={local.welcomePhoto}>
        <Image
          source={assets.welcome}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel="Архитектурный холл с тёплым светом"
        />
        <View style={local.welcomeBrand}>
          <Copy style={{ fontSize: 24, fontWeight: "700" }}>specwatt.</Copy>
          <Copy style={s.caption}>EXPERIENCE / 04</Copy>
        </View>
      </View>
      <Copy style={[s.caption, { color: c.accentAmber }]}>
        ТЕХНОЛОГИЯ СПОКОЙНОЙ ЖИЗНИ
      </Copy>
      <Copy accessibilityRole="header" style={s.heroText}>
        Энергия.
        <Copy style={[s.heroText, { color: c.accentAmber }]}>
          {"\n"}В вашем ритме.
        </Copy>
      </Copy>
      <Copy style={s.muted}>
        Красивый свет. Понятная энергия. Всё под вашим контролем.
      </Copy>
      <NativeButton
        label="Открыть SpecWATT"
        onPress={() => onNavigate("home")}
      />
      <Pressable
        accessibilityRole="button"
        style={s.subtleButton}
        onPress={() => onNavigate("setup")}
      >
        <Copy>Как подключить контроллер</Copy>
      </Pressable>
      <Copy style={s.caption}>ДЕМОНСТРАЦИЯ · БЕЗ ОБОРУДОВАНИЯ</Copy>
    </ScreenShell>
  );
}
export function NativeHome(model: NativeModel) {
  return (
    <ScreenShell>
      <SourceLabel link={model.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Добрый вечер.
      </Copy>
      <NativePower
        watts={model.link === "online" ? totalWatts(model.channels) : null}
      />
      <Copy style={s.section}>Под вашим контролем</Copy>
      <View style={s.grid}>
        {(["CH1", "CH2"] as const).map((id) => (
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
      </View>
      <Surface>
        <View style={s.source}>
          <NativeIcon kind="sun" />
          <Copy style={s.caption}>CH2 / СВЕТОВАЯ СЦЕНА</Copy>
        </View>
        <Svg
          width="100%"
          height={100}
          viewBox="0 0 347 132"
          accessibilityLabel="Архитектурный LED-профиль"
        >
          <Path d="M0 0H347V132H0Z" fill="#292c2a" />
          <Path d="M0 83 347 33V38L0 89Z" fill="#141819" />
          <Path d="M0 88 347 37" stroke="#d19560" strokeWidth={6} />
          <Path d="M0 87 347 36" stroke="#ffe3bb" strokeWidth={2} />
        </Svg>
        <Copy style={[s.section, { fontSize: 24, lineHeight: 32 }]}>
          Свет вдоль стены.
        </Copy>
        <NativeButton
          label="Управлять освещением"
          onPress={() => model.onNavigate("lighting")}
        />
      </Surface>
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
      <SourceLabel link={model.link} />
      <Copy accessibilityRole="header" style={s.title}>
        Атмосферный свет
      </Copy>
      <Copy style={s.caption}>LED-ЛЕНТА / CH2</Copy>
      <View style={local.scene}>
        <Image
          source={assets.lighting}
          resizeMode="cover"
          style={[
            StyleSheet.absoluteFill,
            {
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
      <NativeDeviceTile
        id="CH2"
        on={model.channels.CH2}
        link={model.link}
        onToggle={model.onToggle}
        onOpen={() => model.onNavigate("devices")}
      />
      <View style={s.source}>
        <Copy style={s.section}>Световая сцена</Copy>
        <Copy style={{ fontSize: 28, lineHeight: 36, color: c.accentAmber }}>
          {brightness}%
        </Copy>
      </View>
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
      <NativeButton
        label="Добавить расписание"
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
      <Copy style={s.caption}>SPECWATT / ДЕМО-ИСТОРИЯ</Copy>
      <Copy accessibilityRole="header" style={s.title}>
        Энергия в деталях
      </Copy>
      <View style={s.grid}>
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
      <Copy style={s.caption}>ОБЩЕЕ ПОТРЕБЛЕНИЕ</Copy>
      <Copy style={s.metric}>
        {totals[period].toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
        <Copy style={s.unit}> кВт·ч</Copy>
      </Copy>
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
              fill={i === index ? "#edb17c" : "#817363"}
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
            style={s.subtleButton}
            onPress={() => setSelected(index - 1)}
          >
            <Copy>Назад</Copy>
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
            style={s.subtleButton}
            onPress={() => setSelected(index + 1)}
          >
            <Copy>Далее</Copy>
          </Pressable>
        </View>
      </Surface>
      <Copy style={s.section}>Куда уходит энергия</Copy>
      {(["CH3", "CH2", "CH1"] as const).map((id) => (
        <Pressable
          key={id}
          accessibilityRole="button"
          style={s.subtleButton}
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
      <SourceLabel link={link} />
      <Copy accessibilityRole="header" style={s.title}>
        Под защитой
      </Copy>
      <View style={s.protected}>
        <NativeIcon kind="shield" size={44} color={c.statusProtected} />
        <Copy style={s.caption}>CH3 / PROTECTED CHANNEL</Copy>
        <Copy style={[s.title, { textAlign: "center", fontWeight: "400" }]}>
          Вне управления. Внутри энергобаланса.
        </Copy>
        <Copy style={[s.muted, { textAlign: "center" }]}>
          Исключён из ручного и автоматического переключения.
        </Copy>
      </View>
      <Surface>
        <Copy style={s.caption}>ТЕКУЩАЯ МОЩНОСТЬ · ДЕМО</Copy>
        <Copy style={s.metric}>
          {link === "online" ? "2,4" : "—"}
          <Copy style={s.unit}> Вт</Copy>
        </Copy>
        <Copy style={s.muted}>
          Нет переключателя. Не входит в расписания. Защита реализована в
          модели; аппаратная схема требует отдельной проверки.
        </Copy>
      </Surface>
      <NativeButton
        label="Вернуться к устройствам"
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
