import { useState } from "react";
import { ManualWindPanel, type ManualWindPanelProps } from "./ManualWindPanel.js";
import type { ManualWindState } from "./index.js";

export interface LegacyManualWindPanelProps {
  initialWeather: ManualWindState;
  onWeatherChange(weather: ManualWindState): void;
  headingIcon?: ManualWindPanelProps["headingIcon"];
}

/**
 * Compatibility with the former WeatherPanel: initialWeather seeds a mount.
 * Later initialWeather prop changes do not reset it; remount to reseed.
 * New hosts should use controlled ManualWindPanel instead.
 */
export function LegacyManualWindPanel({ initialWeather, onWeatherChange, headingIcon }: LegacyManualWindPanelProps) {
  const [weather, setWeather] = useState(initialWeather);
  return <ManualWindPanel value={weather} headingIcon={headingIcon} onChange={next => {
    setWeather(next);
    onWeatherChange(next);
  }} />;
}
