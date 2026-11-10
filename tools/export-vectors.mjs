import { build } from "esbuild";
import fs from "node:fs/promises";
// Render the actual React SVGs, not hand-maintained copies.
const result = await build({
  stdin: {
    contents: `
  import React from 'react';
  import {renderToStaticMarkup as render} from 'react-dom/server';
  import {LampIllustration} from './src/screens/DeviceDetail.tsx';
  import {PowerGauge} from './src/components/charts.tsx';
  import * as icons from 'lucide-react';
  export const assets={
    'lamp-on.svg':render(React.createElement(LampIllustration,{on:true})),
    'lamp-off.svg':render(React.createElement(LampIllustration,{on:false})),
    'power-gauge.svg':render(React.createElement(PowerGauge,{value:6.6})).match(/<svg[\\s\\S]*?<\\/svg>/)[0],
    ...Object.fromEntries(['Lightbulb','Sun','Moon','ShieldCheck','LockKeyhole','CalendarDays','Clock3','WifiOff','TriangleAlert','Sparkles','Cpu','Activity'].map(name=>['icons/'+name+'.svg',render(React.createElement(icons[name],{size:24,strokeWidth:1.65,color:'#edb17c'}))]))
  };
`,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  packages: "external",
});
await fs.mkdir("artifacts", { recursive: true });
const target = "artifacts/vector-export.mjs";
await fs.writeFile(target, result.outputFiles[0].text);
const { assets } = await import("../" + target + "?t=" + Date.now());
for (const [name, source] of Object.entries(assets)) {
  const path = "design-export/" + name;
  await fs.mkdir(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  await fs.writeFile(
    path,
    source
      .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace(
        /xmlns="http:\/\/www.w3.org\/2000\/svg"\s+xmlns="http:\/\/www.w3.org\/2000\/svg"/,
        'xmlns="http://www.w3.org/2000/svg"',
      ),
  );
}
console.log(
  `Exported ${Object.keys(assets).length} editable SVG assets from React components.`,
);
