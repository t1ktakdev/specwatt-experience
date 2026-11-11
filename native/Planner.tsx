import React, { useState } from "react";
import { formatTimeInput } from "../src/lib/time-input";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Path, Text as SvgText, Rect } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Copy,
  NativeButton,
  NativeIcon,
  ScreenShell,
  Surface,
  s,
} from "./components";
import { NativeField, NativeToggle } from "./controls";
import {
  loadSegments,
  previewPlan,
  weekdays,
  type Schedule,
} from "../src/lib/planner";
import type { NativeRuntime } from "./useNativeDemo";
import type { NativeModel } from "./screens";
function NativeLoad({ plans, day }: { plans: Schedule[]; day: string }) {
  const segments = loadSegments(plans, day);
  const peak = Math.max(...segments.map((s) => s.watts));
  const y = (w: number) => 126 - (w / 8.4) * 100;
  const path = segments
    .map(
      (s, i) =>
        `${i ? "L" : "M"}${36 + (s.start / 1440) * 288} ${y(s.watts)}H${36 + (s.end / 1440) * 288}`,
    )
    .join(" ");
  return (
    <View>
      <Copy style={s.section}>
        Пиковая нагрузка {peak.toLocaleString("ru-RU")} Вт
      </Copy>
      <Svg
        width="100%"
        height={180}
        viewBox="0 0 336 156"
        fontFamily="Manrope"
        accessible
        accessibilityLabel={`План на ${day}. Пик ${peak} Вт, лимит 7 Вт, CH3 2,4 Вт.`}
      >
        {[0, 2.4, 7, 8.4].map((w) => (
          <React.Fragment key={w}>
            <SvgText
              x={28}
              y={y(w) + 4}
              fill="#b8bdb5"
              fontSize={11}
              textAnchor="end"
            >
              {w.toLocaleString("ru-RU")}
            </SvgText>
            <Path
              d={`M36 ${y(w)}H324`}
              stroke={w === 7 ? "#edb17c" : "#ffffff18"}
              strokeDasharray="3 4"
            />
          </React.Fragment>
        ))}
        {segments
          .filter((s) => s.watts > 7)
          .map((s) => (
            <Rect
              key={s.start}
              x={36 + (s.start / 1440) * 288}
              width={((s.end - s.start) / 1440) * 288}
              y={20}
              height={106}
              fill="#f1a89344"
            />
          ))}
        <Path d={`M36 ${y(2.4)}H324`} stroke="#b8c9b0" strokeWidth={2} />
        <Path
          d={path}
          stroke={peak > 7 ? "#f1a893" : "#edb17c"}
          strokeWidth={2.5}
          fill="none"
        />
        {[0, 6, 12, 18, 24].map((h) => (
          <SvgText
            key={h}
            x={36 + (h / 24) * 288}
            y={148}
            fill="#b8bdb5"
            fontSize={10}
            textAnchor="middle"
          >
            {String(h).padStart(2, "0")}
          </SvgText>
        ))}
      </Svg>
      <Copy style={s.muted}>
        CH3 · 2,4 Вт постоянно. Только номинальный расчёт; исполнение не
        подключено.
      </Copy>
    </View>
  );
}
export function NativePlanner(m: NativeModel & NativeRuntime) {
  const [day, setDay] = useState("Вт"),
    [draft, setDraft] = useState<Schedule | null>(null),
    [error, setError] = useState("");
  const draftPreview = draft ? previewPlan(draft, m.plans, day) : null;
  const open = (p?: Schedule) => {
    setError("");
    setDraft(
      p
        ? { ...p, days: [...p.days] }
        : {
            id: Date.now(),
            channel: "CH2",
            time: "19:00",
            end: "22:30",
            name: "Вечерний свет",
            enabled: true,
            days: ["Пн", "Вт", "Ср", "Чт", "Пт"],
          },
    );
  };
  const save = () => {
    if (!draft) return;
    const error = m.savePlan(draft);
    if (error) {
      setError(error);
      return;
    }
    setDraft(null);
  };
  return (
    <>
      <ScreenShell>
        <Copy accessibilityRole="header" style={s.title}>
          План нагрузки
        </Copy>
        <NativeButton label="Новое расписание" onPress={() => open()} />
        <View style={{ flexDirection: "row", gap: 3 }}>
          {weekdays.map((d) => (
            <Pressable
              key={d}
              accessibilityRole="button"
              accessibilityState={{ selected: d === day }}
              style={[
                s.subtleButton,
                {
                  minWidth: 0,
                  flex: 1,
                  paddingHorizontal: 0,
                  alignItems: "center",
                  borderColor: d === day ? "#edb17c" : "#ffffff18",
                },
              ]}
              onPress={() => setDay(d)}
            >
              <Copy>{d}</Copy>
            </Pressable>
          ))}
        </View>
        <Surface>
          <NativeLoad plans={m.plans} day={day} />
        </Surface>
        <Copy style={s.section}>Ваши расписания</Copy>
        {!m.plans.some((p) => p.days.includes(day)) && (
          <Copy style={s.muted}>
            На этот день интервалов нет. CH3 останется вне расписаний.
          </Copy>
        )}
        {m.plans
          .filter((p) => p.days.includes(day))
          .map((p) => (
            <Surface key={p.id}>
              <Copy style={s.section}>
                {p.time}–{p.end} · {p.channel}
              </Copy>
              <Copy>{p.name}</Copy>
              <NativeToggle
                label={`Расписание ${p.name}`}
                value={p.enabled}
                onChange={() => {
                  const e = m.savePlan({ ...p, enabled: !p.enabled });
                  if (e) setError(e);
                }}
              />
              <NativeButton
                label={`Изменить ${p.name}`}
                onPress={() => open(p)}
              />
              <Pressable
                accessibilityRole="button"
                style={s.subtleButton}
                onPress={() => m.deletePlan(p.id)}
              >
                <Copy>Удалить расписание</Copy>
              </Pressable>
            </Surface>
          ))}
        {error && !draft && <Copy accessibilityRole="alert">{error}</Copy>}
      </ScreenShell>
      <Modal
        visible={!!draft}
        transparent
        animationType={m.reduceMotion ? "none" : "slide"}
        onRequestClose={() => setDraft(null)}
      >
        <SafeAreaView
          edges={["top", "bottom"]}
          style={{ flex: 1, backgroundColor: "#252728" }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "#000a",
            }}
          >
            <ScrollView
              accessibilityViewIsModal
              contentContainerStyle={{
                padding: 24,
                gap: 16,
                backgroundColor: "#252728",
                paddingBottom: 48,
              }}
            >
              {draft && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Copy
                      accessibilityRole="header"
                      style={{ flex: 1, fontSize: 24, lineHeight: 32 }}
                    >
                      Свой ритм света
                    </Copy>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Закрыть расписание"
                      onPress={() => setDraft(null)}
                      style={s.iconButton}
                    >
                      <NativeIcon kind="back" color="#adb0aa" size={20} />
                    </Pressable>
                  </View>
                  <View style={s.grid}>
                    {(["CH1", "CH2"] as const).map((id) => (
                      <Pressable
                        key={id}
                        accessibilityRole="button"
                        accessibilityState={{ selected: draft.channel === id }}
                        style={s.subtleButton}
                        onPress={() => setDraft({ ...draft, channel: id })}
                      >
                        <Copy>{id}</Copy>
                      </Pressable>
                    ))}
                  </View>
                  <NativeField
                    label="Название"
                    value={draft.name}
                    onChange={(name) => setDraft({ ...draft, name })}
                  />
                  <NativeField
                    label="Включить в (ЧЧ:ММ)"
                    keyboardType="number-pad"
                    value={draft.time}
                    onChange={(time) =>
                      setDraft({ ...draft, time: formatTimeInput(time) })
                    }
                  />
                  <NativeField
                    label="Выключить в (ЧЧ:ММ)"
                    keyboardType="number-pad"
                    value={draft.end}
                    onChange={(end) =>
                      setDraft({ ...draft, end: formatTimeInput(end) })
                    }
                  />
                  <View style={s.grid}>
                    {weekdays.map((d) => (
                      <Pressable
                        key={d}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: draft.days.includes(d),
                        }}
                        style={[s.subtleButton, { minWidth: 48 }]}
                        onPress={() =>
                          setDraft({
                            ...draft,
                            days: draft.days.includes(d)
                              ? draft.days.filter((x) => x !== d)
                              : [...draft.days, d],
                          })
                        }
                      >
                        <Copy>{d}</Copy>
                      </Pressable>
                    ))}
                  </View>
                  {draftPreview && (
                    <>
                      <Copy style={s.caption}>
                        Предпросмотр · {draftPreview.day}
                      </Copy>
                      <NativeLoad
                        plans={draftPreview.plans}
                        day={draftPreview.day}
                      />
                    </>
                  )}
                  {error && (
                    <Copy
                      accessibilityRole="alert"
                      style={{ color: "#f1a893" }}
                    >
                      {error}
                    </Copy>
                  )}
                  <Copy style={s.muted}>
                    В памяти текущей сессии. CH3 недоступен в редакторе. Команды
                    по часам не исполняются.
                  </Copy>
                  <NativeButton
                    label="Сохранить демо-план"
                    icon="check"
                    onPress={save}
                  />
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
