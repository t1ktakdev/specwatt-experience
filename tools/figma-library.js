// use_figma script. Construct reusable native components from verified editable source fragments.
const page = await figma.getNodeByIdAsync("4:4");
await figma.setCurrentPageAsync(page);
await Promise.all(
  [
    "Regular",
    "Medium",
    "SemiBold",
    "Bold",
    "Light",
    "ExtraBold",
    "ExtraLight",
  ].map((style) => figma.loadFontAsync({ family: "Manrope", style })),
);
const ids = [],
  components = {},
  sets = {};
const allVars = await figma.variables.getLocalVariablesAsync();
const vars = Object.fromEntries(
  allVars
    .filter((v) => v.variableCollectionId === "VariableCollectionId:4:11")
    .map((v) => [v.name, v]),
);
const styles = await figma.getLocalTextStylesAsync();
const colors = {
  "#17191a": "color/surface/canvas",
  "#252728": "color/surface/raised",
  "#2b2d2d": "color/surface/elevated",
  "#1e2122": "color/surface/inset",
  "#f4f1ea": "color/text/primary",
  "#a7aaa5": "color/text/secondary",
  "#edb17c": "color/accent/amber",
  "#f5bf8c": "color/accent/amberBright",
  "#b8c9b0": "color/status/protected",
  "#e9b887": "color/status/warning",
  "#f1a893": "color/status/error",
};
const hex = (c) =>
  "#" +
  [c.r, c.g, c.b]
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
async function bind(root) {
  for (const n of [root, ...root.findAll(() => true)]) {
    if ("fills" in n && Array.isArray(n.fills))
      n.fills = n.fills.map((p) =>
        p.type === "SOLID" && colors[hex(p.color)]
          ? figma.variables.setBoundVariableForPaint(
              p,
              "color",
              vars[colors[hex(p.color)]],
            )
          : p,
      );
    if ("strokes" in n && Array.isArray(n.strokes))
      n.strokes = n.strokes.map((p) =>
        p.type === "SOLID" && colors[hex(p.color)]
          ? figma.variables.setBoundVariableForPaint(
              p,
              "color",
              vars[colors[hex(p.color)]],
            )
          : p,
      );
    if ("cornerRadius" in n && typeof n.cornerRadius === "number") {
      const v = Object.values(vars).find(
        (v) =>
          v.name.startsWith("radius/") &&
          v.resolveForConsumer(n).value === n.cornerRadius,
      );
      if (v) n.setBoundVariable("cornerRadius", v);
    }
    if ("layoutMode" in n && n.layoutMode !== "NONE")
      for (const prop of [
        "paddingTop",
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "itemSpacing",
      ]) {
        const v = vars[`spacing/scale/${n[prop]}`];
        if (v) n.setBoundVariable(prop, v);
      }
    if (
      n.type === "TEXT" &&
      n.fontName !== figma.mixed &&
      n.fontSize !== figma.mixed
    ) {
      const role =
        n.fontSize >= 50
          ? "metric"
          : n.fontSize >= 24
            ? "heading"
            : n.fontSize >= 15
              ? "section"
              : n.fontSize >= 12
                ? "body"
                : "caption";
      const style = styles.find((s) => s.name === `SpecWATT/${role}`);
      if (style) {
        const before = {
          fontName: n.fontName,
          fontSize: n.fontSize,
          lineHeight: n.lineHeight,
          letterSpacing: n.letterSpacing,
        };
        await n.setTextStyleIdAsync(style.id);
        Object.assign(n, before);
      }
    }
  }
}
async function main(sourceId, name) {
  const source = await figma.getNodeByIdAsync(sourceId);
  const clone = source.clone();
  page.appendChild(clone);
  const comp = figma.createComponentFromNode(clone);
  comp.name = name;
  await bind(comp);
  return comp;
}
function collect(n) {
  ids.push(n.id, ...n.findAll(() => true).map((c) => c.id));
}
async function setFrom(name, entries, x, y) {
  const variants = [];
  for (const e of entries) {
    const comp = await main(e.id, e.name);
    if (e.opacity !== undefined) comp.opacity = e.opacity;
    variants.push(comp);
  }
  const set = figma.combineAsVariants(variants, page);
  set.name = name;
  set.description = `Shared ${name} from React source. Demonstration UI; no hardware acknowledgement.`;
  set.x = x;
  set.y = y;
  variants.forEach((v, i) => {
    v.x = 24 + (i % 4) * (v.width + 28);
    v.y = 56 + Math.floor(i / 4) * (v.height + 40);
    components[`${name}/${v.name}`] = v.id;
  });
  set.resize(
    Math.max(...variants.map((v) => v.x + v.width)) + 24,
    Math.max(...variants.map((v) => v.y + v.height)) + 24,
  );
  sets[name] = set.id;
  collect(set);
  return variants;
}
const toggle = await setFrom(
  "Toggle",
  [
    { id: "7:215", name: "State=Off" },
    { id: "7:250", name: "State=On" },
    { id: "7:215", name: "State=Disabled", opacity: 0.35 },
    { id: "7:250", name: "State=Unavailable", opacity: 0.35 },
  ],
  100,
  100,
);
await setFrom(
  "Navigation",
  [
    { id: "7:355", name: "Active=Home" },
    { id: "7:1037", name: "Active=Devices" },
    { id: "7:812", name: "Active=Energy" },
    { id: "7:1493", name: "Active=Auto" },
  ],
  100,
  350,
);
await setFrom(
  "Primary",
  [
    { id: "7:42", name: "State=Default" },
    { id: "7:42", name: "State=Pressed", opacity: 0.8 },
    { id: "7:42", name: "State=Disabled", opacity: 0.4 },
  ],
  100,
  650,
);
for (const [name, id, x, y] of [
  ["StatusBar", "7:340", 100, 950],
  ["Brand", "7:13", 650, 950],
  ["DemoBadge", "7:121", 1000, 950],
]) {
  const c = await main(id, name);
  c.x = x;
  c.y = y;
  c.description = `Shared ${name} from src/components/ui.tsx`;
  components[name] = c.id;
  collect(c);
}
const cards = [];
for (const layout of ["Tile", "Row"])
  for (const channel of ["CH1", "CH2"])
    for (const state of ["Off", "On", "Unknown"]) {
      const source =
        layout === "Tile"
          ? channel === "CH1"
            ? "7:194"
            : "7:226"
          : channel === "CH1"
            ? "7:912"
            : "7:940";
      const card = await main(
        source,
        `Layout=${layout}, Channel=${channel}, State=${state}`,
      );
      for (const t of card.findAllWithCriteria({ types: ["TEXT"] })) {
        if (["Включено", "Выключено"].includes(t.characters))
          t.characters =
            state === "Unknown"
              ? "Нет связи"
              : state === "On"
                ? "Включено"
                : "Выключено";
        if (/^([04](,2)?) Вт$/.test(t.characters))
          t.characters = `${state === "Unknown" ? "—" : state === "On" ? (channel === "CH1" ? "1,8" : "4,2") : "0"} Вт`;
      }
      const onSource = await figma.getNodeByIdAsync(
        layout === "Tile"
          ? state === "On"
            ? "7:226"
            : "7:194"
          : state === "On"
            ? "7:940"
            : "7:912",
      );
      card.fills = onSource.fills;
      card.strokes = onSource.strokes;
      const old = card.findOne(
        (n) => n.type === "FRAME" && n.name === "Toggle",
      );
      const variant = toggle[state === "On" ? 1 : state === "Unknown" ? 2 : 0];
      const instance = variant.createInstance();
      const parent = old.parent,
        index = parent.children.indexOf(old),
        xy = { x: old.x, y: old.y };
      parent.insertChild(index, instance);
      instance.x = xy.x;
      instance.y = xy.y;
      instance.layoutPositioning = old.layoutPositioning;
      old.remove();
      cards.push(card);
    }
const cardSet = figma.combineAsVariants(cards, page);
cardSet.name = "DeviceCard";
cardSet.description =
  "CH1 and CH2 only. Unknown is not zero. Protected CH3 uses a separate safety passport.";
cardSet.x = 100;
cardSet.y = 1150;
cards.forEach((c, i) => {
  c.x = 24 + (i % 3) * 390;
  c.y = 56 + Math.floor(i / 3) * 230;
  components[`DeviceCard/${c.name}`] = c.id;
});
cardSet.resize(1200, 1030);
sets.DeviceCard = cardSet.id;
collect(cardSet);
const board = figma.createAutoLayout("VERTICAL");
page.appendChild(board);
board.name = "Components / Usage & Safety";
board.x = 1500;
board.y = 100;
board.paddingLeft = 32;
board.paddingRight = 32;
board.paddingTop = 32;
board.paddingBottom = 32;
board.itemSpacing = 20;
board.fills = [{ type: "SOLID", color: { r: 0.09, g: 0.1, b: 0.1 } }];
for (const copy of [
  "SpecWATT / Component library",
  "Toggle: On / Off / Disabled / Unavailable",
  "Navigation: Home / Devices / Energy / Auto",
  "DeviceCard: Tile / Row × CH1 / CH2 × Off / On / Unknown",
  "CH3 has no actuation component.",
  "Shared model: CH1 1.8 W / CH2 4.2 W / CH3 2.4 W / limit 7 W.",
  "Motion: press 200 / screen 350 / chart 420 ms. Respect reduced motion.",
]) {
  const t = figma.createText();
  t.fontName = { family: "Manrope", style: "Regular" };
  t.characters = copy;
  t.fontSize = copy.startsWith("SpecWATT") ? 28 : 14;
  t.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.94, b: 0.92 } }];
  board.appendChild(t);
}
collect(board);
return { createdNodeIds: ids, components, sets, board: board.id };
