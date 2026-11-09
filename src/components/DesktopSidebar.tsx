import { ArrowUpRight } from "lucide-react";
import { Page } from "../types";
import { useApp } from "../state/context";
import { pageLabels } from "../lib/design";
import { Brand } from "./ui";

export function DesktopSidebar({
  page,
  go,
}: {
  page: Page;
  go: (p: Page) => void;
}) {
  const { link } = useApp();
  return (
    <aside className="desktop-sidebar">
      <Brand />
      <div className="desktop-copy">
        <span className="eyebrow">THE SPECWATT EXPERIENCE</span>
        <h1>
          Энергия,
          <br />
          которую
          <br />
          <em>чувствуешь.</em>
        </h1>
        <p>
          Тихая технология.
          <br />
          Красивый свет. Осознанный контроль.
        </p>
      </div>
      <div className="desktop-menu">
        {(["welcome", "home", "lighting", "energy"] as Page[]).map((p, i) => (
          <button
            className={page === p ? "active" : ""}
            key={p}
            onClick={() => go(p)}
          >
            <span>0{i + 1}</span>
            {pageLabels[p]}
            <ArrowUpRight size={17} />
          </button>
        ))}
      </div>
      <div className="desktop-foot">
        <span>
          <i />
          ИНТЕРАКТИВНЫЙ ПРОТОТИП
        </span>
        <p>
          Warm Graphite / Ambient Amber
          <br />
          Симуляция · оборудование не подключено
        </p>
        <span className="desktop-source">
          {link === "online" ? "DEMO MODE" : "CONNECTION PREVIEW"}
          <span>2026</span>
        </span>
      </div>
    </aside>
  );
}
