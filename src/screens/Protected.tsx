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
          <div className="shield-rings">
            <span />
            <span />
            <span />
            <ShieldCheck size={76} strokeWidth={1.1} />
            <i>
              <LockKeyhole size={15} />
            </i>
          </div>
          <span className="eyebrow">CH3 / PROTECTED CHANNEL</span>
          <h2>
            Важное остаётся
            <br />
            неприкосновенным.
          </h2>
          <p>
            Этот канал исключён из ручного
            <br />и автоматического переключения.
          </p>
        </section>
        <div className="protected-measurement material">
          <span>ТЕКУЩАЯ МОЩНОСТЬ</span>
          <b>
            {link === "online" ? "2,4" : "—"} <small>Вт</small>
          </b>
          <DemoBadge />
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
