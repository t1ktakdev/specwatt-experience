// Executed by use_figma. Library bindings and CONFIG are supplied by the orchestrator.
const library = LIBRARY_DATA;
const config = PAGE_CONFIG;
const page = await figma.getNodeByIdAsync(config.page);
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
BIND_HELPERS;
const created = [],
  screens = [],
  cache = {};
async function component(key) {
  if (!cache[key]) cache[key] = await figma.getNodeByIdAsync(library[key]);
  return cache[key];
}
async function replace(n, key, label) {
  const c = await component(key);
  if (!c) throw new Error(`Missing component ${key}`);
  const parent = n.parent,
    index = parent.children.indexOf(n);
  const before = {
    name: n.name,
    width: n.width,
    height: n.height,
    x: n.x,
    y: n.y,
    position: n.layoutPositioning,
    transform: n.relativeTransform,
    h: n.layoutSizingHorizontal,
    v: n.layoutSizingVertical,
    row: n.gridRowAnchorIndex,
    col: n.gridColumnAnchorIndex,
    rs: n.gridRowSpan,
    cs: n.gridColumnSpan,
  };
  const grid =
    parent.layoutMode === "GRID"
      ? { rows: parent.gridRowCount, cols: parent.gridColumnCount }
      : null;
  n.remove();
  const instance = c.createInstance();
  parent.insertChild(index, instance);
  instance.name = before.name;
  instance.resize(before.width, before.height);
  instance.layoutPositioning = before.position;
  if (grid && before.position !== "ABSOLUTE") {
    instance.setGridChildPosition(before.row, before.col);
    instance.gridRowSpan = before.rs;
    instance.gridColumnSpan = before.cs;
    parent.gridRowCount = grid.rows;
    parent.gridColumnCount = grid.cols;
  } else {
    instance.relativeTransform = before.transform;
    if (
      parent.layoutMode &&
      parent.layoutMode !== "NONE" &&
      before.position !== "ABSOLUTE"
    ) {
      instance.layoutSizingHorizontal = before.h;
      instance.layoutSizingVertical = before.v;
    }
  }
  if (label !== undefined) instance.setProperties({ "Label#12:0": label });
  return instance;
}
async function rebuild(root, route) {
  for (const n of [...root.children]) {
    if (n.type !== "FRAME") continue;
    const content = [
      "Home",
      "Lighting",
      "Energy",
      "Devices",
      "DeviceDetail",
      "Autopilot",
      "Planner",
      "Journal",
      "Setup",
      "Settings",
      "Protected",
    ].includes(n.name);
    if (n.name.endsWith(":transform") || content) n.opacity = 1;
    if (content && n.parent.name.endsWith(":transform")) {
      n.x = 0;
      n.y = 0;
    }
    if (n.opacity > 0.299 && n.opacity < 0.301) {
      n.opacity = 1;
      if (n.parent.name.endsWith(":transform")) {
        n.x = 0;
        n.y = 0;
      }
    }
    if (n.name.startsWith("Range Slider")) {
      for (const child of [...n.children]) child.remove();
      n.layoutMode = "NONE";
      n.fills = [];
      n.strokes = [];
      const w = n.width,
        h = n.height,
        lighting = n.name.includes("Яркость"),
        cx = lighting ? 7 + ((w - 14) * 2) / 3 : w - 7;
      const vector = figma.createNodeFromSvg(
        `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M7 ${h / 2}H${w - 7}" stroke="#393e37" stroke-width="5" stroke-linecap="round"/><path d="M7 ${h / 2}H${cx}" stroke="#edb17c" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${h / 2}" r="7" fill="${lighting ? "#f4ead4" : "#edb17c"}"/></svg>`,
      );
      n.appendChild(vector);
      vector.x = 0;
      vector.y = 0;
      continue;
    }
    if (n.name === "DeviceCard") {
      const texts = n
        .findAllWithCriteria({ types: ["TEXT"] })
        .map((t) => t.characters);
      const channel = texts.includes("CH1") ? "CH1" : "CH2",
        state = texts.includes("Нет связи")
          ? "Unknown"
          : texts.includes("Включено")
            ? "On"
            : "Off",
        layout = n.width > 200 ? "Row" : "Tile";
      await replace(
        n,
        `DeviceCard/Layout=${layout}, Channel=${channel}, State=${state}`,
      );
      continue;
    }
    if (n.name === "Nav") {
      const active = ["devices", "device", "lighting", "protected"].includes(
        route,
      )
        ? "Devices"
        : ["autopilot", "planner"].includes(route)
          ? "Auto"
          : route === "energy"
            ? "Energy"
            : "Home";
      await replace(n, `Navigation/Active=${active}`);
      continue;
    }
    if (n.name === "StatusBar") {
      await replace(n, "StatusBar");
      continue;
    }
    if (n.name === "Brand") {
      await replace(n, n.width < 135 ? "BrandSmall" : "Brand");
      continue;
    }
    if (
      n.name === "DemoBadge" &&
      n
        .findAllWithCriteria({ types: ["TEXT"] })
        .some((t) => t.characters === "ДЕМО")
    ) {
      await replace(n, "DemoBadge");
      continue;
    }
    if (n.name === "Toggle") {
      const on =
        n.children.length > 1 && n.children[n.children.length - 1].x > 10;
      await replace(
        n,
        `Toggle/State=${n.opacity < 0.9 ? "Disabled" : on ? "On" : "Off"}`,
      );
      continue;
    }
    if (n.name === "Primary") {
      const label = n.findOne((t) => t.type === "TEXT");
      await replace(
        n,
        route === "welcome"
          ? "Primary/State=Default"
          : "PrimaryAccent/State=Default",
        label.characters,
      );
      continue;
    }
    if (n.children.length) await rebuild(n, route);
  }
}
for (const [i, item] of config.screens.entries()) {
  let frame = page.children.find((n) => n.name === item.name);
  if (!frame) {
    const source = await figma.getNodeByIdAsync(item.source);
    frame = source.clone();
    page.appendChild(frame);
    frame.name = item.name;
    frame.x = 100 + i * 457;
    frame.y = 100;
    frame.clipsContent = true;
    await rebuild(frame, item.route);
    await bind(frame);
  }
  created.push(frame.id, ...frame.findAll(() => true).map((n) => n.id));
  const types = frame
    .findAll(() => true)
    .reduce((a, n) => ((a[n.type] = (a[n.type] || 0) + 1), a), {});
  const images = frame
    .findAll(
      (n) =>
        "fills" in n &&
        Array.isArray(n.fills) &&
        n.fills.some((p) => p.type === "IMAGE"),
    )
    .map((n) => ({ id: n.id, name: n.name, width: n.width, height: n.height }));
  screens.push({
    id: frame.id,
    name: frame.name,
    route: item.route,
    source: item.source,
    width: frame.width,
    height: frame.height,
    types,
    images,
  });
}
return { createdNodeIds: created, page: page.id, screens };
