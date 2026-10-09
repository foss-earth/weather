import type { ReactNode } from "react";
import { CALM_MANUAL_WIND, MANUAL_WIND_BOUNDS, type ManualWindState } from "./index.js";

export interface ManualWindPanelProps {
  /** The host's accepted/current manual wind value. */
  value: ManualWindState;
  /** A requested next value; the host chooses when and how to apply it. */
  onChange(value: ManualWindState): void;
  /** Optional host presentation; no icon library or app implementation is imported. */
  headingIcon?: ReactNode;
}

/** Faithful current direction/speed/reset controls, with explicit host state. */
export function ManualWindPanel({ value, onChange, headingIcon }: ManualWindPanelProps) {
  const updateWeather = (partial: Partial<ManualWindState>): void => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className="foss-earth-manual-wind">
      <div className="foss-earth-manual-wind__heading">
        <div><span>Conditions</span><strong>Custom wind</strong></div>
        {headingIcon}
      </div>
      <label className="foss-earth-manual-wind__field">
        <span>Wind direction <output>{value.windDirectionDeg.toFixed(0)}°</output></span>
        <input
          type="range"
          min={MANUAL_WIND_BOUNDS.windDirectionDeg.min}
          max={MANUAL_WIND_BOUNDS.windDirectionDeg.max}
          step="any"
          value={value.windDirectionDeg}
          title="Meteorological wind direction: where the wind comes from, clockwise from north"
          onChange={(event) => updateWeather({ windDirectionDeg: Number(event.target.value) })}
        />
      </label>
      <label className="foss-earth-manual-wind__field">
        <span>Wind speed <output>{value.windSpeedKts.toFixed(0)} kt</output></span>
        <input
          type="range"
          min={MANUAL_WIND_BOUNDS.windSpeedKts.min}
          max={MANUAL_WIND_BOUNDS.windSpeedKts.max}
          step="any"
          value={value.windSpeedKts}
          onChange={(event) => updateWeather({ windSpeedKts: Number(event.target.value) })}
        />
      </label>
      <button className="foss-earth-manual-wind__command" type="button" onClick={() => onChange({ ...CALM_MANUAL_WIND })}>
        Clear wind
      </button>
    </div>
  );
}
