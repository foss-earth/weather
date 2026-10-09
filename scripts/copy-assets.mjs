import { copyFileSync, mkdirSync } from "node:fs";
const target = new URL("../dist/styles/weather.css", import.meta.url);
mkdirSync(new URL("./", target), { recursive: true });
copyFileSync(new URL("../src/styles/weather.css", import.meta.url), target);
