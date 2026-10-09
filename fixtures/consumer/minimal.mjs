import assert from "node:assert/strict";
import { readFileSync, realpathSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const workspaceRoot = realpathSync(path.dirname(fileURLToPath(import.meta.url))) + path.sep;
registerHooks({ resolve(specifier, context, nextResolve) {
  const resolved = nextResolve(specifier, context);
  if (resolved.url.startsWith("file:") && !realpathSync(fileURLToPath(resolved.url)).startsWith(workspaceRoot)) throw new Error(`Dependency escaped installed consumer: ${specifier}`);
  return resolved;
} });
for (const name of ["window", "document", "navigator", "localStorage"]) Object.defineProperty(globalThis, name, { configurable: true, get() { throw new Error(`Unexpected browser access: ${name}`); } });
const weather = await import("@foss-earth/weather");
assert.deepEqual(weather.CALM_MANUAL_WIND, { windDirectionDeg: 0, windSpeedKts: 0 });
assert.deepEqual(weather.MANUAL_WIND_BOUNDS, { windDirectionDeg: { min: 0, max: 359 }, windSpeedKts: { min: 0, max: 50 } });
assert.match(readFileSync(new URL(import.meta.resolve("@foss-earth/weather/styles.css")), "utf8"), /flex-wrap:\s*wrap/);
process.stdout.write("Weather installed-artifact pure root without React/browser access and paragraph-grid CSS passed.\n");
