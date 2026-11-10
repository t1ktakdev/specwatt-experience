import { ShieldCheck, Check } from "lucide-react";
import { Primary } from "./ui";
export function LimitDialog({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="modal material"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="dialog-icon">
        <ShieldCheck size={32} />
      </span>
      <h2 id="dialog-title">Лимит защищает ваш стенд</h2>
      <p>
        Включение обоих каналов создаст нагрузку <b>8,4 Вт</b> при лимите{" "}
        <b>7 Вт</b>. Сначала выключите другой управляемый канал.
      </p>
      <p className="muted">CH3 остаётся защищённым. Изменение не применено.</p>
      <Primary onClick={onClose} icon={Check}>
        Понятно
      </Primary>
    </section>
  );
}
