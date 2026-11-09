import { ArrowUpRight } from "lucide-react";
import { useApp } from "../state/context";
import { scene } from "../lib/design";
import { Brand, Primary } from "../components/ui";

export function Welcome() {
  const { go } = useApp();
  return (
    <div className="welcome">
      <img
        className="welcome-photo"
        src={scene}
        alt="Камерная гостиная с янтарным светом подвесного светильника"
      />
      <div className="welcome-vignette" />
      <div className="welcome-top">
        <Brand />
        <span className="edition">SMART ENERGY</span>
      </div>
      <div className="welcome-progress">
        <i />
        <i />
        <i />
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">МЕНЬШЕ ЛИШНЕГО. БОЛЬШЕ ЖИЗНИ.</span>
        <h1>
          Энергия.
          <br />В вашем
          <br />
          <em>ритме.</em>
        </h1>
        <p>
          Красивый свет. Понятная энергия.
          <br />
          Всё под вашим контролем.
        </p>
        <Primary onClick={() => go("home")}>Открыть SpecWATT</Primary>
        <button className="welcome-setup" onClick={() => go("setup")}>
          Подключить свой контроллер
          <ArrowUpRight size={15} />
        </button>
        <div className="welcome-foot">
          <span>СОЗДАНО ДЛЯ ОСОЗНАННОЙ ЭНЕРГИИ</span>
          <span>ДЕМО</span>
        </div>
      </div>
    </div>
  );
}
