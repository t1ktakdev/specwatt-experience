import { useRef, useState } from "react";
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
  function onToggle(id: ChannelId) {
    const result = requestSwitch(current.current, id, link);
    if (!result.ok) {
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
    onNotice("Состояние изменено только в локальной демо-модели");
  }
  return { channels, link, setLink, onToggle };
}
