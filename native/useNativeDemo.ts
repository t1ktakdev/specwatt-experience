import { useRef, useState } from "react";
import { validatePlan, type Schedule } from "../src/lib/planner";
import type { LogEntry } from "../src/types";
import {
  initialChannels,
  requestSwitch,
  type ChannelId,
  type LinkState,
} from "../src/model";

/** Local model only. Host routes and storage remain the Expo application's responsibility. */
export function useNativeDemo(onNotice: (message: string) => void) {
  const [channels, setChannels] = useState({ ...initialChannels });
  const current = useRef(channels);
  const [link, setLink] = useState<LinkState>("online");
  const [events, setEvents] = useState<LogEntry[]>([
    {
      title: "Демо-сессия начата",
      detail: "CH3 защищён · оборудование не подключено",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      kind: "system",
    },
  ]);
  const [plans, setPlans] = useState<Schedule[]>([]);
  const plansRef = useRef(plans);
  const [allow, setAllow] = useState({ CH1: false, CH2: false });
  const [auto, setAuto] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  function record(entry: Omit<LogEntry, "time">) {
    setEvents((items) =>
      [
        {
          ...entry,
          time: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...items,
      ].slice(0, 100),
    );
  }
  function onToggle(id: ChannelId) {
    const result = requestSwitch(current.current, id, link);
    if (!result.ok) {
      if (result.reason === "limit")
        record({
          title: "Запрос отклонён",
          detail: "8,4 Вт выше предела 7 Вт. Состояние не изменено.",
          kind: "warning",
          channel: id,
        });
      onNotice(
        result.reason === "protected"
          ? "CH3 защищён"
          : result.reason === "limit"
            ? "8,4 Вт превышают лимит 7 Вт. Сначала выключите другой канал."
            : "Нет актуального соединения. Состояние не изменено.",
      );
      return;
    }
    current.current = result.next;
    setChannels(result.next);
    record({
      title: `${id}: ${result.next[id] ? "включено" : "выключено"}`,
      detail: "Локальная демо-модель · не команда оборудованию",
      kind: "light",
      channel: id,
    });
    onNotice("Состояние изменено только в локальной демо-модели");
  }
  function changeConsent(id: "CH1" | "CH2") {
    const next = { ...allow, [id]: !allow[id] };
    setAllow(next);
    if (!next.CH1 && !next.CH2) setAuto(false);
    record({
      title: `${id}: разрешение ${next[id] ? "выдано" : "отозвано"}`,
      detail: "Только демо-правила",
      kind: "auto",
      channel: id,
    });
  }
  function changeAuto() {
    if (link !== "online" || (!allow.CH1 && !allow.CH2)) {
      onNotice("Сначала разрешите канал и восстановите демо-соединение.");
      return;
    }
    setAuto(!auto);
    record({
      title: auto ? "Демо-автопилот выключен" : "Демо-автопилот разрешён",
      detail: "Фоновые команды не выполняются",
      kind: "auto",
    });
  }
  function savePlan(plan: Schedule) {
    const error = validatePlan(plan, plansRef.current);
    if (error) return error;
    const next = [...plansRef.current.filter((p) => p.id !== plan.id), plan];
    plansRef.current = next;
    setPlans(next);
    record({
      title: "Демо-план сохранён",
      detail: `${plan.channel} · ${plan.time}–${plan.end} · без исполнения`,
      kind: "auto",
      channel: plan.channel,
    });
    return null;
  }
  function deletePlan(id: number) {
    const next = plansRef.current.filter((p) => p.id !== id);
    plansRef.current = next;
    setPlans(next);
    record({
      title: "Демо-план удалён",
      detail: "Из локальной сессии",
      kind: "auto",
    });
  }
  function changeLink(next: LinkState) {
    setLink(next);
    if (next !== "online") setAuto(false);
    record({
      title: `Состояние: ${next}`,
      detail: "Предпросмотр интерфейса, без сетевого запроса",
      kind: "system",
    });
  }
  return {
    channels,
    link,
    setLink: changeLink,
    onToggle,
    events,
    record,
    plans,
    savePlan,
    deletePlan,
    allow,
    auto,
    changeConsent,
    changeAuto,
    reduceMotion,
    setReduceMotion,
  };
}
export type NativeRuntime = ReturnType<typeof useNativeDemo>;
