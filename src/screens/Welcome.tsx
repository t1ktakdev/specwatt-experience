import { ArrowUpRight } from "lucide-react";
import { useApp } from "../state/context";
import { visuals } from "../lib/design";
import { Brand, Primary } from "../components/ui";

export function Welcome() {
  const { go } = useApp();
  return (
    <div className="welcome">
      <img
        className="welcome-photo"
        src={visuals.welcome}
        srcSet={`${visuals.welcomeSmall} 480w, ${visuals.welcome} 960w`}
        sizes="(max-width: 760px) 100vw, 393px"
        width="960"
        height="1440"
        fetchPriority="high"
        alt="Архитектурный холл с бронзовым светильником и тёплым светом на травертине"
      />
      <div className="welcome-vignette" />
      <div className="welcome-top">
        <Brand />
        <span className="edition">SMART ENERGY</span>
      </div>
      <div className="welcome-progress">
        <span>EXPERIENCE / 03</span>
        <i />
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">ТЕХНОЛОГИЯ СПОКОЙНОЙ ЖИЗНИ</span>
        <h1>
          Энергия.
          <br />
          <em>В вашем ритме.</em>
        </h1>
        <p>
          Красивый свет. Понятная энергия.
          <br />
          Всё под вашим контролем.
        </p>
        <Primary onClick={() => go("home")}>Открыть SpecWATT</Primary>
        <button className="welcome-setup" onClick={() => go("setup")}>
          Как подключить контроллер
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
