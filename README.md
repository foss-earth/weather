# @foss-earth/weather

Manual wind state and the controls for editing it, for FOSS Earth. This
package owns the world state and its presentation. The flight simulator keeps
conversion of wind to JSBSim and its application to physics; no flight code is
imported or duplicated here.

| Export | Contents |
| --- | --- |
| `@foss-earth/weather` | `ManualWindState`, `MANUAL_WIND_BOUNDS`, `CALM_MANUAL_WIND`. Pure and dependency-free. |
| `@foss-earth/weather/react` | Controlled `ManualWindPanel({value, onChange, headingIcon?})` and the legacy `LegacyManualWindPanel`. React is an optional peer dependency (^19.2.4). |
| `@foss-earth/weather/styles.css` | Panel styling: controls at their own width, wrapping as a paragraph grid. The host decides where the panel sits (tab or window). |

## Wind state

- `windDirectionDeg` is the meteorological FROM direction, clockwise from
  north, 0 through 359.
- `windSpeedKts` is the speed in knots, 0 through 50.
- The calm value is direction 0, speed 0.

These are the bounds of the existing controls, not an atmosphere model. Both
controls use `step="any"` and keep fractional values. Values stay in these
units. The package does no vector or JSBSim conversion and advances no clock.

## Panels

`ManualWindPanel` is controlled. It displays the `value` the host supplies.
Each edit calls `onChange` with a new object that keeps the other field;
"Clear wind" requests 0/0. The host decides whether to accept the change and
passes the accepted value back. Rendering calls no action, mutates no host
record and installs no global input handler. Native range controls keep their
own keys, and unused keys and gestures pass to the host's input handling. The
optional `headingIcon` is supplied by the host, so the panel needs no icon
library.

`LegacyManualWindPanel({initialWeather, onWeatherChange, headingIcon?})` keeps
the earlier behavior: it seeds local state from `initialWeather`, reports each
change immediately through `onWeatherChange`, and ignores later changes to
`initialWeather`. Remount it to reseed. Use `ManualWindPanel` for new code.

The package stores no settings and registers no settings ID. It adds no Weather
tab of its own; the host composes the tab.

## Not included

Vertical profiles, temperature, pressure, humidity, visibility, clouds,
precipitation, gusts, turbulence, hazards, live data providers, source decoders
and a world sampler are not implemented. The package makes no network requests.
Planning notes for broader weather work are in [docs](docs).

## Development

The package has no `@foss-earth/*` dependencies. Scripts from `package.json`:

```sh
npm install
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run test:consumer` (with `typecheck:consumer`) checks the built package
as an installed consumer. It requires `WEATHER_CONSUMER_ARCHIVES`, a JSON file
listing package archives (`{version: 1, packages: [{name, version, archive,
sha256, bytes}]}`), and is not part of normal development.

## License and notices

AGPL-3.0-only; see [LICENSE](LICENSE) and [NOTICE](NOTICE). The NOTICE file
is carried over from the original 0SFS application. Third-party packages,
JSBSim data, aircraft and reference assets, imagery and online services have
their own licenses and terms, which this package does not grant. No such assets
are included here.

## Project policies

- [Code of conduct](https://github.com/foss-earth/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/foss-earth/.github/blob/main/CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](https://github.com/foss-earth/.github/blob/main/SECURITY.md)
