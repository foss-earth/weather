// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ManualWindPanel, LegacyManualWindPanel } from "../src/react.js";
import type { ManualWindState } from "../src/index.js";

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function moveRange(index: number, value: number): void {
  const input = container.querySelectorAll<HTMLInputElement>('input[type="range"]')[index]!;
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    set.call(input, String(value));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("manual wind host boundary", () => {
  it("renders current values/bounds and follows external host updates without a mount callback", () => {
    const onChange = vi.fn();
    act(() => root.render(<ManualWindPanel value={{ windDirectionDeg: 270, windSpeedKts: 12 }} onChange={onChange} />));
    expect(onChange).not.toHaveBeenCalled();
    const inputs = [...container.querySelectorAll<HTMLInputElement>('input[type="range"]')];
    expect(inputs.map(input => [input.min, input.max, input.value])).toEqual([["0", "359", "270"], ["0", "50", "12"]]);
    expect(inputs[0]!.title).toMatch(/comes from/);
    act(() => root.render(<ManualWindPanel value={{ windDirectionDeg: 180, windSpeedKts: 25 }} onChange={onChange} />));
    expect([...container.querySelectorAll("output")].map(output => output.textContent)).toEqual(["180°", "25 kt"]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("requests a merged value without mutating accepted host state or applying units", () => {
    const value = Object.freeze({ windDirectionDeg: 270, windSpeedKts: 12 });
    const onChange = vi.fn();
    act(() => root.render(<ManualWindPanel value={value} onChange={onChange} />));
    moveRange(0, 359);
    expect(onChange).toHaveBeenLastCalledWith({ windDirectionDeg: 359, windSpeedKts: 12 });
    expect(value).toEqual({ windDirectionDeg: 270, windSpeedKts: 12 });
    // Requests stay based on the accepted host value until it is supplied again.
    moveRange(1, 50);
    expect(onChange).toHaveBeenLastCalledWith({ windDirectionDeg: 270, windSpeedKts: 50 });
  });

  it("clear requests calm without changing state until the host accepts it", () => {
    const onChange = vi.fn();
    const value = { windDirectionDeg: 90, windSpeedKts: 4 };
    act(() => root.render(<ManualWindPanel value={value} onChange={onChange} />));
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ windDirectionDeg: 0, windSpeedKts: 0 });
    expect(container.querySelector("output")!.textContent).toBe("90°");
  });

  it("keeps continuous directions and speeds in complete numeric pair requests", () => {
    const onChange = vi.fn(); const value = { windDirectionDeg: 90.25, windSpeedKts: 4.5 };
    act(() => root.render(<ManualWindPanel value={value} onChange={onChange} />));
    expect([...container.querySelectorAll<HTMLInputElement>('input[type="range"]')].map(input => input.step)).toEqual(["any", "any"]);
    moveRange(0, 91.75); expect(onChange).toHaveBeenLastCalledWith({ windDirectionDeg: 91.75, windSpeedKts: 4.5 });
    moveRange(1, 3.125); expect(onChange).toHaveBeenLastCalledWith({ windDirectionDeg: 90.25, windSpeedKts: 3.125 });
    expect(value).toEqual({ windDirectionDeg: 90.25, windSpeedKts: 4.5 });
  });

  it("passes unused keys and wheel gestures through for the host input owner", () => {
    const key = vi.fn();
    const wheel = vi.fn();
    container.addEventListener("keydown", key);
    container.addEventListener("wheel", wheel);
    act(() => root.render(<ManualWindPanel value={{ windDirectionDeg: 0, windSpeedKts: 0 }} onChange={() => {}} />));
    const input = container.querySelector("input")!;
    const keyEvent = new KeyboardEvent("keydown", { key: "x", bubbles: true, cancelable: true });
    const wheelEvent = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    input.dispatchEvent(keyEvent); input.dispatchEvent(wheelEvent);
    expect(key).toHaveBeenCalledOnce(); expect(wheel).toHaveBeenCalledOnce();
    expect(keyEvent.defaultPrevented).toBe(false); expect(wheelEvent.defaultPrevented).toBe(false);
  });

  it("legacy wrapper keeps original mount-seeding and reseeds only on remount", () => {
    const requested: ManualWindState[] = [];
    const onWeatherChange = (value: ManualWindState): void => { requested.push(value); };
    act(() => root.render(<LegacyManualWindPanel initialWeather={{ windDirectionDeg: 45, windSpeedKts: 8 }} onWeatherChange={onWeatherChange} />));
    moveRange(1, 10);
    expect(requested).toEqual([{ windDirectionDeg: 45, windSpeedKts: 10 }]);
    act(() => root.render(<LegacyManualWindPanel initialWeather={{ windDirectionDeg: 180, windSpeedKts: 20 }} onWeatherChange={onWeatherChange} />));
    expect([...container.querySelectorAll("output")].map(output => output.textContent)).toEqual(["45°", "10 kt"]);
    act(() => root.render(<LegacyManualWindPanel key="new-mount" initialWeather={{ windDirectionDeg: 180, windSpeedKts: 20 }} onWeatherChange={onWeatherChange} />));
    expect([...container.querySelectorAll("output")].map(output => output.textContent)).toEqual(["180°", "20 kt"]);
    expect(requested).toHaveLength(1);
  });
});
