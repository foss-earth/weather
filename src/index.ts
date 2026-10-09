/** Current manual wind controls. Direction is the meteorological FROM bearing. */
export interface ManualWindState {
  /** Degrees clockwise from north, from 0 through 359. */
  windDirectionDeg: number;
  /** Knots, from 0 through 50. */
  windSpeedKts: number;
}

/** Existing UI bounds; no unit conversion or weather evolution occurs here. */
export const MANUAL_WIND_BOUNDS = Object.freeze({
  windDirectionDeg: Object.freeze({ min: 0, max: 359 }),
  windSpeedKts: Object.freeze({ min: 0, max: 50 }),
});

export const CALM_MANUAL_WIND: Readonly<ManualWindState> = Object.freeze({
  windDirectionDeg: 0,
  windSpeedKts: 0,
});
