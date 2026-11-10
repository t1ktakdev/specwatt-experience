import { MonitorSmartphone, Radio, ShieldCheck } from "lucide-react";
/** Connection architecture, deliberately not a claim of an ESP32 board layout. */
export function ConnectionTopology({ step }: { step: number }) {
  return (
    <div className={`connection-topology topology-step-${step}`}>
      <div className="topology-path">
        <span>
          <MonitorSmartphone size={26} />
          <b>Интерфейс</b>
        </span>
        <i />
        <span>
          <Radio size={26} />
          <b>Демо-модель</b>
        </span>
      </div>
      <div className="topology-branches">
        <span>
          CH1 <small>1,8 Вт</small>
        </span>
        <span>
          CH2 <small>4,2 Вт</small>
        </span>
        <span>
          <ShieldCheck size={16} />
          CH3 <small>2,4 Вт</small>
        </span>
      </div>
      <p>
        {step === 3
          ? "Локальная сессия · оборудование не подключено"
          : "Схема демонстрации · не аппаратная плата"}
      </p>
    </div>
  );
}
