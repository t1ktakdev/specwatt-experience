import { nominal, type ChannelState } from "../model";
import { fmt } from "../lib/design";

/** Nominal local-model budget, never a substitute for unknown telemetry. */
export function LoadBudget({
  channels,
  known,
}: {
  channels: ChannelState;
  known: boolean;
}) {
  return (
    <div className="load-budget">
      <div className="budget-heading">
        <span>Баланс нагрузки</span>
        <span>
          Лимит <b>7 Вт</b>
        </span>
      </div>
      <div
        className={`budget-meter ${known ? "" : "unknown"}`}
        role="img"
        aria-label={
          known
            ? "CH3: 2,4 Вт; управляемые каналы и свободный резерв до 7 Вт"
            : "Текущая нагрузка неизвестна. Номинал защищённого CH3: 2,4 Вт"
        }
      >
        <i className="budget-base" style={{ width: `${(2.4 / 7) * 100}%` }} />
        {known && channels.CH1 && (
          <i className="budget-ch1" style={{ width: `${(1.8 / 7) * 100}%` }} />
        )}
        {known && channels.CH2 && (
          <i className="budget-ch2" style={{ width: `${(4.2 / 7) * 100}%` }} />
        )}
      </div>
      <div className="budget-labels">
        {(["CH3", "CH1", "CH2"] as const).map((id) => (
          <span key={id} className={`budget-label-${id.toLowerCase()}`}>
            <small>
              <i />
              {id}
              {id === "CH3" ? " · защита" : ""}
            </small>
            <b>
              {known ? fmt(channels[id] ? nominal[id] : 0) : "—"} <em>Вт</em>
            </b>
          </span>
        ))}
      </div>
    </div>
  );
}
