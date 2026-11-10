// Executed by figma-remote use_figma, not by Node. TOKEN_DATA is replaced with design-tokens.json.
const tokens = TOKEN_DATA;
const created = [];
const pageNames = [
  "00 Cover & Product Principles",
  "01 Foundations / Tokens / Typography",
  "02 Component Library / Variants / States",
  "03 Main: Welcome, Home, Lighting, Energy",
  "04 Devices & Detail & Protected",
  "05 Autopilot & Planner & Journal",
  "06 Onboarding (3 steps) & Settings",
  "07 Edge Cases: offline/loading/error/empty/overload/permission",
  "08 Handoff / React-Native-Mapping",
];
figma.root.children[0].name = pageNames[3];
for (const name of pageNames)
  if (!figma.root.children.some((p) => p.name === name)) {
    const p = figma.createPage();
    p.name = name;
    created.push(p.id);
  }
const page = figma.root.children.find((p) => p.name === pageNames[1]);
await figma.setCurrentPageAsync(page);
await Promise.all(
  ["Regular", "Medium", "SemiBold", "Bold"].map((style) =>
    figma.loadFontAsync({ family: "Manrope", style }),
  ),
);
const existing = await figma.variables.getLocalVariableCollectionsAsync();
const primitives =
  existing.find((c) => c.name === "SpecWATT / Primitives") ||
  figma.variables.createVariableCollection("SpecWATT / Primitives");
const semantics =
  existing.find((c) => c.name === "SpecWATT / Semantics") ||
  figma.variables.createVariableCollection("SpecWATT / Semantics");
const all = await figma.variables.getLocalVariablesAsync();
const vars = {};
function rgba(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: 1,
  };
}
function variable(name, type, value, scopes, syntax) {
  let p = all.find(
    (v) => v.name === name && v.variableCollectionId === primitives.id,
  );
  if (!p) {
    p = figma.variables.createVariable(name, primitives, type);
    p.scopes = [];
    p.setValueForMode(primitives.defaultModeId, value);
  }
  let s = all.find(
    (v) => v.name === name && v.variableCollectionId === semantics.id,
  );
  if (!s) {
    s = figma.variables.createVariable(name, semantics, type);
    s.scopes = scopes;
    s.setValueForMode(semantics.defaultModeId, {
      type: "VARIABLE_ALIAS",
      id: p.id,
    });
    s.setVariableCodeSyntax("WEB", `var(--${syntax})`);
    s.setVariableCodeSyntax("ANDROID", name.replaceAll("/", "."));
    s.setVariableCodeSyntax("iOS", name.replaceAll("/", "."));
  }
  vars[name] = s;
}
for (const [group, values] of Object.entries(tokens.color))
  for (const [name, token] of Object.entries(values))
    variable(
      `color/${group}/${name}`,
      "COLOR",
      rgba(token.$value),
      group === "text"
        ? ["TEXT_FILL"]
        : ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"],
      `color-${group}-${name}`,
    );
for (const [group, scope] of [
  ["radius", "CORNER_RADIUS"],
  ["spacing", "GAP"],
  ["motion", "OPACITY"],
])
  for (const [name, token] of Object.entries(tokens[group]))
    if (token.$value)
      variable(
        `${group}/${name}`,
        "FLOAT",
        token.$value.value,
        group === "motion" ? [] : [scope],
        `${group}-${name}`,
      );
for (const value of tokens.spacing.scale)
  variable(`spacing/scale/${value}`, "FLOAT", value, ["GAP"], `space-${value}`);
const styles = {};
const previous = await figma.getLocalTextStylesAsync();
for (const [name, t] of Object.entries(tokens.typography)) {
  const style =
    previous.find((s) => s.name === `SpecWATT/${name}`) ||
    figma.createTextStyle();
  style.name = `SpecWATT/${name}`;
  style.fontName = {
    family: "Manrope",
    style:
      t.fontWeight >= 600
        ? "SemiBold"
        : t.fontWeight >= 500
          ? "Medium"
          : "Regular",
  };
  style.fontSize = t.fontSize;
  style.lineHeight = { unit: "PERCENT", value: (t.lineHeight || 1.5) * 100 };
  styles[name] = style.id;
}
function text(parent, copy, size = 14, color = "color/text/primary") {
  const t = figma.createText();
  created.push(t.id);
  t.fontName = { family: "Manrope", style: "Regular" };
  t.fontSize = size;
  t.characters = copy;
  t.fills = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
      "color",
      vars[color],
    ),
  ];
  parent.appendChild(t);
  return t;
}
const board = figma.createAutoLayout("VERTICAL");
created.push(board.id);
board.name = "Foundations / shared source of truth";
board.x = 100;
board.y = 100;
board.paddingLeft = 40;
board.paddingRight = 40;
board.paddingTop = 40;
board.paddingBottom = 40;
board.itemSpacing = 28;
board.resize(900, 400);
board.primaryAxisSizingMode = "AUTO";
board.fills = [
  figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    vars["color/surface/canvas"],
  ),
];
text(board, "SpecWATT / Foundations", 36);
text(
  board,
  "Warm Graphite × Ambient Amber · Manrope · RU · DEMO",
  16,
  "color/text/secondary",
);
for (const [name, v] of Object.entries(vars).filter(([n]) =>
  n.startsWith("color/"),
)) {
  const row = figma.createAutoLayout("HORIZONTAL");
  created.push(row.id);
  row.name = name;
  row.fills = [];
  row.itemSpacing = 20;
  row.counterAxisAlignItems = "CENTER";
  board.appendChild(row);
  const swatch = figma.createRectangle();
  created.push(swatch.id);
  swatch.name = name;
  swatch.resize(64, 40);
  swatch.cornerRadius = 8;
  swatch.fills = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
      "color",
      v,
    ),
  ];
  row.appendChild(swatch);
  text(row, name, 14);
}
for (const [name, id] of Object.entries(styles)) {
  const sample =
    name === "metric"
      ? "6,6 Вт"
      : name === "analytics"
        ? "0,91 кВт·ч"
        : "Свет под контролем.";
  const t = text(board, `${name} / ${sample}`);
  await t.setTextStyleIdAsync(id);
}
text(
  board,
  "Spacing 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48",
  14,
  "color/text/secondary",
);
text(
  board,
  "Press 200 ms · Screen 350 ms · Chart 420 ms · Reduced motion: 0",
  14,
  "color/text/secondary",
);
return {
  createdNodeIds: created,
  pages: Object.fromEntries(figma.root.children.map((p) => [p.name, p.id])),
  collections: { primitives: primitives.id, semantics: semantics.id },
  variables: Object.fromEntries(
    Object.entries(vars).map(([n, v]) => [n, v.id]),
  ),
  textStyles: styles,
  board: board.id,
};
