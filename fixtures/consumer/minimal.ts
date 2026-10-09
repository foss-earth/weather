import { CALM_MANUAL_WIND, MANUAL_WIND_BOUNDS, type ManualWindState } from "@foss-earth/weather";
import { ManualWindPanel, LegacyManualWindPanel, type ManualWindPanelProps } from "@foss-earth/weather/react";
const value: ManualWindState = { ...CALM_MANUAL_WIND };
const props: ManualWindPanelProps = { value, onChange: next => { value.windDirectionDeg = next.windDirectionDeg; value.windSpeedKts = next.windSpeedKts; } };
ManualWindPanel(props);
LegacyManualWindPanel({ initialWeather: value, onWeatherChange: props.onChange });
void MANUAL_WIND_BOUNDS;
