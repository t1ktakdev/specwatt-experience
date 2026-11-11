// Execute with figma-remote use_figma in the existing V4.1 file.
// Reuses the same screen/component IDs; does not replace screens or libraries.
async function loadPageFonts(page) {
  const fonts = new Map();
  for (const t of page.findAllWithCriteria({ types: ["TEXT"] }))
    for (const s of t.getStyledTextSegments(["fontName"]))
      fonts.set(JSON.stringify(s.fontName), s.fontName);
  for (const font of fonts.values()) await figma.loadFontAsync(font);
}
async function fixPlanner(wrapperId, buttonId) {
  const wrapper = await figma.getNodeByIdAsync(wrapperId);
  const button = await figma.getNodeByIdAsync(buttonId);
  wrapper.gridColumnSpan = 2;
  wrapper.gridChildHorizontalAlign = "MIN";
  wrapper.resize(305, 52);
  button.layoutSizingHorizontal = "FILL";
  return {
    wrapper: wrapper.id,
    button: button.id,
    x: button.x,
    width: button.width,
  };
}
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("69:9"));
await loadPageFonts(figma.currentPage);
const planner = await fixPlanner("75:2139", "75:2140");
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("89:9"));
await loadPageFonts(figma.currentPage);
const prototypePlanner = await fixPlanner("91:1494", "91:1495");
const links = [
  ["91:1725", "91:9"],
  ["91:2227", "91:1722"],
  ["91:2306", "91:2224"],
  ["91:5061", "BACK"],
  ["91:1927", "91:1722"],
  ["91:1947", "91:1564"],
  ["91:1976", "91:2085"],
  ["91:1016", "91:1123"],
  ["91:1031", "91:1359"],
  ["91:634", "91:2085"],
  ["91:653", "91:363"],
  ["91:679", "91:950"],
  ["I91:160;94:35", "91:4163"],
  ["I91:810;94:87", "91:4163"],
  ["91:988", "91:4163"],
  ["91:4175", "BACK"],
  ["91:4176", "BACK"],
];
for (const [id, target] of links) {
  const node = await figma.getNodeByIdAsync(id);
  await node.setReactionsAsync([
    {
      trigger: { type: "ON_CLICK" },
      actions: [
        target === "BACK"
          ? { type: "BACK" }
          : {
              type: "NODE",
              destinationId: target,
              navigation: "NAVIGATE",
              resetScrollPosition: true,
              transition: {
                type: "DISSOLVE",
                duration: 0.24,
                easing: { type: "EASE_OUT" },
              },
            },
      ],
    },
  ]);
}
const canvas = await figma.variables.getVariableByIdAsync("VariableID:4:13");
const fixed = [];
for (const frame of figma.currentPage.children.filter(
  (n) => n.type === "FRAME",
)) {
  const index = frame.children.findIndex((n) => n.name === "StatusBar");
  if (index < 0) continue;
  // Absolute positioning alone does not fix a layer during prototype scrolling.
  // Editor overlays follow Nav and must stay above it, so include them as well.
  frame.numberOfFixedChildren = frame.children.length - index;
  if (frame.name !== "Prototype / welcome")
    frame.children[index].fills = [
      figma.variables.setBoundVariableForPaint(
        { type: "SOLID", color: { r: 23 / 255, g: 25 / 255, b: 26 / 255 } },
        "color",
        canvas,
      ),
    ];
  fixed.push([frame.id, frame.numberOfFixedChildren]);
}
return { planner, prototypePlanner, links, fixed };
