import { ShieldCheck, LockKeyhole, Activity } from "lucide-react";
import { useApp } from "../state/context";
import { Header, DemoBadge, Nav, DetailRow } from "../components/ui";

export function Protected() {
  const { go, link } = useApp();
  return (
    <>
      <main className="screen-content protected-content">
        <Header title="Под защитой" back action="none" />
        <section className="shield-hero">
          <div className="safety-passport-head">
            <span className="passport-channel">CH3</span>
            <ShieldCheck size={44} strokeWidth={1.4} />
          </div>
          <span className="safety-seal">
            <LockKeyhole size={14} /> ПОСТОЯННАЯ ЗАЩИТА В МОДЕЛИ
          </span>
          <h2>
            Вне управления.
            <br />
            Внутри энергобаланса.
          </h2>
          <p>
            Номинальная нагрузка канала учитывается перед каждым действием CH1 и
            CH2.
          </p>
        </section>
        <div className="protected-measurement material">
          <span>ТЕКУЩАЯ МОЩНОСТЬ</span>
          <b>
            {link === "online" ? "2,4" : "—"} <small>Вт</small>
          </b>
          <DemoBadge />
        </div>
        <div className="safety-budget">
          <span>
            Базовая нагрузка <b>2,4 Вт</b>
          </span>
          <span>
            Лимит стенда <b>7 Вт</b>
          </span>
          <div>
            <i />
          </div>
          <small>CH3 занимает 34% лимита · расчёт по номиналу</small>
        </div>
        <div className="protection-rules">
          <DetailRow
            icon={LockKeyhole}
            title="Нет удалённого переключения"
            detail="Через приложение и автоматизацию"
          />
          <DetailRow
            icon={ShieldCheck}
            title="Не входит в расписания"
            detail="Правила CH1 / CH2 не затрагивают CH3"
          />
          <DetailRow
            icon={Activity}
            title="События сохраняются"
            detail="Отдельный след в журнале"
            onClick={() => go("journal")}
          />
        </div>
        <p className="fine-note">
          Защита реализована в модели симулятора. Аппаратная схема ESP32 и её
          защита требуют отдельной проверки.
        </p>
      </main>
      <Nav active="devices" />
    </>
  );
}
