# @foss-earth/weather

Private staging version 0.1.0 extracts the existing manual wind controls from
committed 0SFS source `8bc8af6080ebb5e97c0982d2c8ff5e22519f5ac2`, tree
`1198098ab13b30f01cf1862d9bbcf9c5fc939fb6`. FOSS Earth owns this world state
and presentation. Flight continues to own conversion/application to JSBSim at its
accepted physics boundary. No flight source is imported or duplicated here.

| Export | Public contract |
| --- | --- |
| `@foss-earth/weather` | `ManualWindState`, `MANUAL_WIND_BOUNDS`, `CALM_MANUAL_WIND`; pure and dependency-free. |
| `@foss-earth/weather/react` | Controlled `ManualWindPanel({value,onChange,headingIcon?})`; optional legacy mount-seeded wrapper. |
| `@foss-earth/weather/styles.css` | Controls at their own width, wrapping as a paragraph grid. Host owns tab/window placement. |

`windDirectionDeg` is a meteorological FROM direction, clockwise from north,
in degrees from 0 through 359. `windSpeedKts` is speed in knots from 0 through 50.
The default/calm value is direction 0, speed 0. These are the existing control
bounds and records, not an atmosphere model. Both controls use `step="any"`
and preserve fractional numeric pair requests. Values remain in declared units;
this package performs no vector or JSBSim conversion and advances no clock.

The controlled panel displays the supplied host value. Each edit requests a new
object with the other supplied field preserved; Clear wind requests 0/0. The
host decides when to accept/apply it and supplies accepted values again. Rendering
calls no action, mutates no host record and installs no global input handler.
Native range controls retain their own keys and unused keys/gestures pass to the
host input owner. The optional heading icon is host supplied, so the panel has no
flight or icon-library dependency. Its old Conditions/Custom wind labels,
degree/knot readouts, range bounds and reset behavior are preserved.

`LegacyManualWindPanel({initialWeather,onWeatherChange,headingIcon?})` retains
the former panel's `useState(initialWeather)` behavior: changes are local and
reported immediately, later `initialWeather` prop changes do not reset it.
Remount to reseed. Use the controlled panel for new host integration. No hidden
saved settings record, migration key or SettingsRegistry ID is invented: committed
Flight controls had none. No new Weather tab is added to Earth's default 13-tab
inventory; Flight owns its existing Weather tab composition.

This release does not implement authored/seeded vertical profiles, temperature,
pressure, humidity, visibility, coherent clouds, precipitation, gusts, turbulence,
weather hazards, live providers, source decoders or a world sampler. The broader
staged weather specification and untracked advanced Earth weather/dirty atmosphere
source are excluded. Those capabilities must be implemented and qualified through
their later acceptance gates. No provider request or network disclosure occurs.

`provenance.json` records exact original component/source hashes and extraction
changes; original AGPL license and 0SFS NOTICE remain verbatim. Cross-source
filtered lineage must be confirmed by the coordinator before commits/publication.
The source's whole FlightControlPanel is mixed and remains Flight-owned; only its
manual wind interface and WeatherPanel are selected for this destination.

Source and isolated-consumer tests are prepared but have not run. Reserve a
coordinator window, retain its dated log, then run `npm run ci` once. Typecheck
and build use incremental `node_modules/.tmp`; lint uses `node_modules/.cache`;
Vitest caps workers at 50%. Set `WEATHER_CONSUMER_ARCHIVES` to a complete
archive-closure JSON: `{version:1,packages:[{name,version,archive,sha256,bytes}]}`.
Paths resolve relative to that JSON. Supply actual Weather0.1.0, React and
ReactDOM19.2.6, React types19.2.14/DOM types19.2.3, TypeScript5.9.3,
jsdom29.1.1 and every transitive runtime/type archive, all exact versions/digests/
sizes. The harness packs no local source or ancestor tooling. It installs offline
with scripts disabled in an owner-build workspace/cache/temp, verifies the
complete installed versions, and uses realpath runtime/declaration isolation
guards with negative controls. Pure root/CSS imports forbid React/browser access;
optional server rendering and actual DOM controls preserve host acceptance,
fractional pair edits and legacy remount behavior. Strict public declaration
compilation does not skip library declarations. Fixtures cover host updates, immutable merge/calm requests, unused
input propagation and legacy remount behavior. No supported platform range or
visual/device qualification is claimed before checks. No server is required.

Adoption replaces the private WeatherPanel and its interface with public imports,
keeps host wind state and JSBSim conversion/application unchanged, and removes
duplicate old sliders only in Flight's own integration change. Rollback restores
those former private imports and the old dependency lock; units and record shape
are unchanged. Exact artifact/source pins, Flight consumer-adoption evidence,
shared installed CI conformance/full intended refs and actual remote admission
are pending. The source/caller is pinned to reviewed
9e046dd482e0229dc7c7b2d71b079d5905664656; it is not yet a published release.
Every destination uses the same pinned foss-earth/ci component; metadata checks
must cover docs-only changes.


## Project policies

- [Code of conduct](https://github.com/foss-earth/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/foss-earth/.github/blob/main/CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](https://github.com/foss-earth/.github/blob/main/SECURITY.md)
