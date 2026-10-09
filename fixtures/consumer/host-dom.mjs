import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><main></main>"), saved = new Map();
for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, IS_REACT_ACT_ENVIRONMENT: true })) {
  saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, value });
}
let root;
try {
  const { act, createElement } = await import("react"), { createRoot } = await import("react-dom/client");
  const { ManualWindPanel, LegacyManualWindPanel } = await import("@foss-earth/weather/react");
  const container = dom.window.document.querySelector("main"); root = createRoot(container);
  const requested = [], onChange = value => requested.push(value);
  const render = (component, props) => act(() => root.render(createElement(component, props)));
  const move = (index, value) => act(() => {
    const input = container.querySelectorAll('input[type="range"]')[index];
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(input, String(value));
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  const value = Object.freeze({ windDirectionDeg: 270.25, windSpeedKts: 12.5 });
  render(ManualWindPanel, { value, onChange }); assert.deepEqual(requested, []);
  assert.deepEqual([...container.querySelectorAll("input")].map(input => [input.min, input.max, input.step]), [["0", "359", "any"], ["0", "50", "any"]]);
  move(0, 359); assert.deepEqual(requested.at(-1), { windDirectionDeg: 359, windSpeedKts: 12.5 });
  move(1, 3.125); assert.deepEqual(requested.at(-1), { windDirectionDeg: 270.25, windSpeedKts: 3.125 });
  assert.deepEqual(value, { windDirectionDeg: 270.25, windSpeedKts: 12.5 });
  render(ManualWindPanel, { value: { windDirectionDeg: 180, windSpeedKts: 25 }, onChange });
  assert.deepEqual([...container.querySelectorAll("output")].map(output => output.textContent), ["180°", "25 kt"]);
  act(() => container.querySelector("button").click()); assert.deepEqual(requested.at(-1), { windDirectionDeg: 0, windSpeedKts: 0 });
  assert.equal(container.querySelector("output").textContent, "180°");
  let propagated = 0; container.addEventListener("wheel", () => { propagated += 1; });
  const wheel = new dom.window.WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true }); container.querySelector("input").dispatchEvent(wheel);
  assert.equal(propagated, 1); assert.equal(wheel.defaultPrevented, false);
  const beforeLegacy = requested.length;
  render(LegacyManualWindPanel, { initialWeather: { windDirectionDeg: 45, windSpeedKts: 8 }, onWeatherChange: onChange });
  assert.equal(requested.length, beforeLegacy); move(1, 10); assert.deepEqual(requested.at(-1), { windDirectionDeg: 45, windSpeedKts: 10 });
  render(LegacyManualWindPanel, { initialWeather: { windDirectionDeg: 180, windSpeedKts: 20 }, onWeatherChange: onChange });
  assert.deepEqual([...container.querySelectorAll("output")].map(output => output.textContent), ["45°", "10 kt"]);
  const beforeRemount = requested.length;
  render(LegacyManualWindPanel, { key: "new-mount", initialWeather: { windDirectionDeg: 180, windSpeedKts: 20 }, onWeatherChange: onChange });
  assert.deepEqual([...container.querySelectorAll("output")].map(output => output.textContent), ["180°", "20 kt"]); assert.equal(requested.length, beforeRemount);
  process.stdout.write("Actual installed Weather controls preserve host acceptance, continuous pair requests, input propagation and legacy remount semantics.\n");
} finally {
  if (root) { const { act } = await import("react"); act(() => root.unmount()); }
  for (const [name, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  dom.window.close();
}
