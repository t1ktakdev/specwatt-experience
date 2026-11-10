const page = await figma.getNodeByIdAsync("4:2");
await figma.setCurrentPageAsync(page);
await Promise.all(
  ["Regular", "Medium", "SemiBold", "Bold"].map((style) =>
    figma.loadFontAsync({ family: "Manrope", style }),
  ),
);
const frame = figma.createAutoLayout("VERTICAL");
frame.name = "SpecWATT / Experience V4";
frame.x = 100;
frame.y = 100;
frame.resize(1000, 800);
frame.primaryAxisSizingMode = "AUTO";
frame.paddingLeft = 64;
frame.paddingRight = 64;
frame.paddingTop = 56;
frame.paddingBottom = 56;
frame.itemSpacing = 28;
frame.fills = [{ type: "SOLID", color: { r: 0.09, g: 0.1, b: 0.1 } }];
const ids = [frame.id];
function text(copy, size, color) {
  const t = figma.createText();
  t.fontName = { family: "Manrope", style: "Regular" };
  t.fontSize = size;
  t.characters = copy;
  t.textAutoResize = "HEIGHT";
  t.resize(872, t.height);
  t.fills = [{ type: "SOLID", color: color || { r: 0.96, g: 0.94, b: 0.92 } }];
  frame.appendChild(t);
  ids.push(t.id);
  return t;
}
text("SPECWATT / EXPERIENCE V4", 14, { r: 0.929, g: 0.694, b: 0.486 });
text("Энергия под контролем.\nСвет с характером.", 52);
text(
  "Warm Graphite × Ambient Amber\n12 маршрутов · 3 шага настройки · 15 состояний",
  20,
);
const photo = figma.createRectangle();
photo.name = "Original architecture / content photograph";
photo.resize(872, 340);
const welcome = await figma.getNodeByIdAsync("15:298");
const image = welcome.findOne(
  (n) =>
    "fills" in n &&
    Array.isArray(n.fills) &&
    n.fills.some((p) => p.type === "IMAGE"),
);
photo.fills = image.fills;
photo.cornerRadius = 14;
frame.appendChild(photo);
ids.push(photo.id);
text("Одна модель: React + React Native + Figma.", 22);
text(
  "CH1 1,8 Вт / CH2 4,2 Вт / CH3 2,4 Вт / предел 7 Вт.\nДемонстрация. Оборудование не подключено. CH3 не переключается.",
  15,
  { r: 0.7, g: 0.76, b: 0.69 },
);
const main = await figma.getNodeByIdAsync("21:257");
const button = main.createInstance();
button.name = "Открыть навигационный прототип";
button.setProperties({ "Label#12:0": "Открыть прототип" });
frame.appendChild(button);
await button.setReactionsAsync([
  {
    trigger: { type: "ON_CLICK" },
    actions: [
      {
        type: "URL",
        url: "https://www.figma.com/proto/CZEjsvoYoT7888KQ0o7B5Q/SpecWATT?node-id=25-232&page-id=25-231&scaling=scale-down",
      },
    ],
  },
]);
ids.push(button.id, ...button.findAll(() => true).map((n) => n.id));
text(
  "Навигационные переходы находятся на странице 09.\nЛогика нагрузки и взаимодействия выполняются в React / native host.\nНативная проверка на устройстве ещё не проведена.",
  14,
  { r: 0.65, g: 0.67, b: 0.65 },
);
return { createdNodeIds: ids, cover: frame.id };
