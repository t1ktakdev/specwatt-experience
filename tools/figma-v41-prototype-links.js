await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("89:9"));
const frames = [
  { id: "91:9", key: "welcome", route: "welcome" },
  { id: "91:68", key: "home", route: "home" },
  { id: "91:363", key: "lighting", route: "lighting" },
  { id: "91:528", key: "energy", route: "energy" },
  { id: "91:756", key: "devices", route: "devices" },
  { id: "91:950", key: "device", route: "device" },
  { id: "91:1123", key: "autopilot", route: "autopilot" },
  { id: "91:1359", key: "planner", route: "planner" },
  { id: "91:1564", key: "journal", route: "journal" },
  { id: "91:1722", key: "setup", route: "setup" },
  { id: "91:1839", key: "settings", route: "settings" },
  { id: "91:2085", key: "protected", route: "protected" },
  { id: "91:2224", key: "setup-2", route: "setup-2" },
  { id: "91:2303", key: "setup-3", route: "setup-3" },
  { id: "91:2403", key: "state-0", route: "home" },
  { id: "91:2715", key: "state-1", route: "home" },
  { id: "91:3017", key: "state-2", route: "home" },
  { id: "91:3321", key: "state-3", route: "lighting" },
  { id: "91:3486", key: "state-4", route: "device" },
  { id: "91:3659", key: "state-5", route: "journal" },
  { id: "91:3788", key: "state-6", route: "autopilot" },
  { id: "91:4024", key: "state-7", route: "protected" },
  { id: "91:4163", key: "state-overload", route: "limit" },
  { id: "91:4182", key: "energy-day", route: "energy" },
  { id: "91:4425", key: "energy-month", route: "energy" },
  { id: "91:4647", key: "planner-saved", route: "planner" },
  { id: "91:4875", key: "planner-editing", route: "planner" },
  { id: "91:5187", key: "planner-conflict", route: "planner" },
  { id: "91:5502", key: "permission-granted", route: "autopilot" },
];
const dest = Object.fromEntries(frames.map((f) => [f.key, f.id]));
const ids = [];
function text(n) {
  return n.type === "TEXT"
    ? n.characters
    : "findAllWithCriteria" in n
      ? n
          .findAllWithCriteria({ types: ["TEXT"] })
          .map((t) => t.characters)
          .join(" ")
      : "";
}
async function link(n, target, source) {
  if (!dest[target] || dest[target] === source.id) return;
  await n.setReactionsAsync([
    {
      trigger: { type: "ON_CLICK" },
      actions: [
        {
          type: "NODE",
          destinationId: dest[target],
          navigation: "NAVIGATE",
          transition: {
            type: "DISSOLVE",
            duration: 0.24,
            easing: { type: "EASE_OUT" },
          },
          preserveScrollPosition: false,
        },
      ],
    },
  ]);
  ids.push(n.id);
}
for (const cfg of frames) {
  const f = await figma.getNodeByIdAsync(cfg.id);
  const nav = f
    .findAllWithCriteria({ types: ["INSTANCE"] })
    .find((n) => n.name === "Nav");
  if (nav)
    for (const [i, k] of ["home", "devices", "energy", "autopilot"].entries())
      await link(nav.children[i], k, cfg);
  const buttons = f.findAll(
    (n) =>
      (n.type === "FRAME" || n.type === "INSTANCE") &&
      /^(Button|Primary|IconButton)/.test(n.name),
  );
  for (const n of buttons) {
    const t = text(n);
    if (!t) continue;
    let target = null;
    if (t === "Назад") {
      await n.setReactionsAsync([
        { trigger: { type: "ON_CLICK" }, actions: [{ type: "BACK" }] },
      ]);
      ids.push(n.id);
      continue;
    }
    if (
      t.includes("Как подключить контроллер") ||
      t.includes("Подключение контроллера") ||
      t.startsWith("Подключение ESP32")
    )
      target = "setup";
    else if (
      t.includes("Все устройства") ||
      t.includes("К управлению устройствами") ||
      t.includes("Ваши устройства")
    )
      target = "devices";
    else if (
      t.includes("Как работает защита") ||
      t.includes("CH3 под защитой") ||
      t.includes("Постоянная защищённая нагрузка") ||
      t.includes("Защита CH3") ||
      t.includes("Защита вашего расписания")
    )
      target = "protected";
    else if (
      t.includes("Открыть SpecWATT") ||
      t.includes("Начать знакомство") ||
      t.includes("Пока изучить демо") ||
      t.includes("Посмотреть на главной") ||
      t.includes("подключённому демо")
    )
      target = "home";
    else if (t.includes("Посмотреть настройку")) target = "setup-2";
    else if (t.includes("Продолжить настройку")) target = "setup-3";
    else if (
      t.includes("Сохранить демо-план") &&
      cfg.key !== "planner-conflict"
    )
      target = "planner-saved";
    else if (t.includes("Понятно")) target = "home";
    else if (
      t.includes("Управлять освещением") ||
      t === "LED-лента Атмосферный свет"
    )
      target = "lighting";
    else if (t === "Светильник Основной свет") target = "device";
    else if (
      t.includes("Новое расписание") ||
      t === "Добавить" ||
      t.includes("Первое расписание") ||
      t === "Изменить"
    )
      target = "planner-editing";
    else if (t.includes("Журнал событий") || t === "Журнал") target = "journal";
    else if (
      t.includes("Расписание") ||
      t.includes("Добавить расписание") ||
      t.includes("План нагрузки")
    )
      target = "planner";
    else if (t.includes("Автопилот") || t.includes("Правила автоматизации"))
      target = "autopilot";
    else if (t.includes("Аналитика")) target = "energy";
    if (cfg.route === "energy" && ["День", "Неделя", "Месяц"].includes(t))
      target = { День: "energy-day", Неделя: "energy", Месяц: "energy-month" }[
        t
      ];
    if (target) await link(n, target, cfg);
  }
  const header = f
    .findAllWithCriteria({ types: ["FRAME"] })
    .find((n) => n.name === "Header");
  if (header) {
    const action = header.findAll((n) => n.name === "IconButton");
    for (const b of action)
      await link(b, cfg.route === "home" ? "journal" : "settings", cfg);
  }
}
return {
  mutatedNodeIds: ids,
  reactions: ids.length,
  frames: frames.length,
  playback: "Not tested: no playback tool is exposed",
};
