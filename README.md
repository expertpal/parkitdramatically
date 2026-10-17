# Park It. Dramatically.

A single-scene browser physics game by Illya Konovalov / ExpertPal. Drive up the ramp, clear the delivery van, use a finite compressed-air tank, and park on four wheels. The accepted gameplay concept is preserved in `concept-reference.png`.

## Play

- Left/right arrows: drive, brake, reverse (ground only).
- A: rear jet (raises the tail; clockwise torque).
- D: front jet (raises the nose; counterclockwise torque).
- Space: both jets, with attitude leveling assistance.
- R: instant retry. P/Escape: pause. Sound toggle in the top right.
- Touch: dedicated hold buttons with independent pointers.

Tap both jets near the ramp lip, coast, then pulse them on descent. A full tank provides three seconds with both jets, or six with one jet. Rotation persists when jets are released. Both jets engage an intentional arcade leveling assist; this is not a physical Tesla simulation. Landing pad ground friction helps stop the car once drive is released.

## Implementation

Dependency-free ES modules, Canvas 2D, CSS/HTML interface, Web Audio synthesis. Fixed 120 Hz simulation independent of render frame rate. Wheel contacts use normal impulses and angular inertia. Van collision uses convex polygon SAT. The simulation requires a settled, upright, slow landing with the car inside the marked space. Hard landings and roof impacts fail. A following camera keeps unusually high jumps visible. Best score is stored locally; no accounts, telemetry, or backend.

The scenery is an image-generated clean plate derived from the approved concept. All interactive objects, jets, smoke, shadows, motion, and scoring are live. The car and van use simplified vector shapes rather than the painted shapes in the concept. The scene is designed for landscape; portrait retains the full course with compact touch controls.

## Validation

Run `node test-physics.mjs`. Verified: idle state, opposite independent jet torque, finite air without negative values, momentum after release, van collision, hard landing failure, multiple successful landing timings, a complete flip and successful landing, and frozen terminal state. Source syntax checks are also run. Offscreen Canvas render QA uses the same production renderer.

Browser-control tooling was unavailable in the build environment. Real-browser keyboard/touch behavior, audio quality, responsive HTML/CSS, and subjective game feel still require hands-on acceptance. Automated landability is evidence of mechanical feasibility, not proof that every player will find the controls intuitive.

## Scope

One car, one scene, one van, one parking space, instant retry, local best score. Earned gifts and a short Mars finale expand the single parking challenge. No online leaderboard or monetization. A useful next playtest is whether a new player can make a clean landing in five attempts; tune jet strength and coaching based on that observation before adding content.

## Earned gifts and space update

The first clean landing unlocks a parachute. A flip followed by a clean landing, or three clean landings total, unlocks a rocket engine. Equip one gift before an attempt. E / the on-screen gift button deploys the chute or fires the rocket while held. The chute can be deployed once per attempt in atmosphere; arrow buttons steer while descending. The rocket has a separate six-second tank and stabilizes toward upright flight. Both reset on retry.

Unlocks and selected gear persist under `park-it-progress-v2`. Previous successful best scores grant the first parachute, so existing players keep their progress. Reaching space gives a milestone message; there is no upper screen-boundary death. The altitude scale, diminishing gravity, and space threshold are deliberately arcade approximations.

The former nested-background zoom has been removed. The game now draws exactly one camera view: an expanded airport panorama feathered into a continuously rendered sky, a procedural infinite starfield, and an atmospheric limb at high altitude. The camera follows vertical and horizontal travel at constant object scale; it fills the complete viewport, including portrait layouts.

`node test-upgrades.mjs` covers unlock ordering, alternative rocket criteria, previous-score migration, saved progress round-trips, locked gear, rocket fuel exhaustion, continuous space flight, one-time milestone events, camera bounds, and a parachute-assisted landing. Offscreen render checks cover airport, high flight, upper atmosphere, and space, verifying opaque coverage and no duplicate backdrop draws. Live-browser QA remains unavailable in this environment.

## Touch layout

Touch-capable devices, windows up to 900 px wide, and windows up to 500 px high get a dedicated bottom control dock. It supports independent simultaneous pointers, includes a larger Both jets button, and keeps the contextual gift action and Retry visible. Keyboard controls continue to work on compact and hybrid devices. Equipment selection appears between attempts and collapses once the car starts moving.

The playfield physically excludes the dock. Landscape framing fits the complete runway above the controls, while portrait remains playable. The compact HUD shows air, altitude, sound, and pause; keyboard prompts and the large title are hidden. A dismissible portrait rotation suggestion disappears after starting. Orientation changes pause active flight and clear held inputs. Pointer cancellation, lost capture, blur, and resizing also clear contacts.

Run `node test-touch.mjs` for simultaneous-input, independent-release, lost-capture, disabled-control, mixed-input, viewport-geometry, and touch-instruction checks. Real mobile browser interaction and visual CSS layout still need device acceptance testing; no browser-control facility is available here.

## Mars mission

After 60 seconds of active simulation above the space threshold, the Mars mission button becomes available. A fictional distance countdown and growing procedural red planet make coasting purposeful. The ready state holds until the player chooses to launch; Retry / R always returns to Earth. Distances and the minute-long journey are arcade fiction, not current astronomical measurements.

Launching begins a 20-second automatic capsule finale. A white single-engine capsule separates, the abandoned car drifts down and rotates, and the camera moves toward the Martian surface. At 12 seconds the message reads “Houston, landing on Mars”; touchdown happens at 17 seconds, followed by dust, a parking flag and “Parked. On Mars.” The final button returns to Earth. Car controls are disabled and labelled as capsule autopilot during this sequence; pause, tab hiding and orientation-change pause remain supported. No score or Earth parking unlock is granted by the cinematic. A local Mars milestone persists.

`npm test` includes the actual rocket-to-space route and a full mission: one-minute unlock, waiting for a click, nonnegative distance, pause, one-time events, reset and milestone persistence. Production Canvas frames were inspected at separation, approach and touchdown, including portrait and short landscape sizes. Browser control remains unavailable; live DOM layout, device interaction and audio still need hands-on acceptance.

## Roadster silhouette and background characters

The car now has a lower flowing canopy, long pointed nose, sculpted shoulders and thin headlamps. It remains a live Canvas drawing; existing wheel centres, thruster mounts and physics are retained, including its appearance in the Mars separation.

Two transparent four-pose sprite sheets add a small cheerleader and a flag-waving airport marshaller behind the runway. Fixed source rectangles and foot anchors prevent scale pumping during animation. These are first-pass sketch loops, not full character rigs. Reduced-motion preferences freeze them. Missing or loading images do not block gameplay.

Open `/art-preview.html` for enlarged animated studies with a pause control. Original sheets live at `dist/assets/cheerleader-sheet.png` and `dist/assets/marshaller-sheet.png`; the built-in image-generation prompts are in `ART-PROMPTS.md`.

## Run details and altitude milestones

Each attempt randomly chooses one spectator: the airport marshaller beside the ramp or the cheerleader behind the right side of the parking bay. The choice stays fixed until retry. At the existing HUD altitude scale, 1 km, 10 km and 100 km queue the requested one-time jokes, each with 4.5 seconds to read. A code-drawn pelican crosses once on ascent after 4 km. The small bird is scenery and has no collision.

Twenty bright green aliens appear at Mars touchdown, following the curved surface and jumping independently. Their animation continues after the mission timer ends, respects pause, and freezes under reduced-motion preferences. The footer now reads “Questionably engineered by expertpal”, linked to https://expertpal.de.

`test-flight-details.mjs` covers a real rocket ascent, milestone order and non-repetition, spectator selection, pelican uniqueness, fresh attempt state and bounded alien positions across viewport shapes.

## Smooth flight and alien arrival

Rendering now interpolates between the 120 Hz simulation states and uses the same displayed position for the camera. The capsule timeline is interpolated too, and separation starts from the car’s displayed position. A reproduced 144 Hz coasting case previously alternated by 5.31 world pixels per display frame; the regression test measures less than 0.001 after the fix across 60, 90, 120, 144, 165 and 240 Hz. Physics and input simulation remain unchanged. This is numerical reproduction, not a substitute for live browser/device verification.

The alien crowd now runs in with staggered timing and settles into an irregular perspective ring sized from the landed capsule’s base. Each alien starts cheering only after reaching its spot. Back and front rows render around the ship, and their glow is much weaker. Reduced motion shows the gathered crowd without running or jumping.

## Rare bicycle pelican and post-landing surprise

The 4 km flyby has a 20% chance per attempt of showing the simplified pelican riding a floating bicycle, with turning wheels and pedalling legs. The choice is sampled once when a run is created; the other 80% retain the ordinary pelican. No repeated per-frame chance rolls.

Aliens now approach from a compact central patch of Martian terrain below the capsule, then fan out around its base and cheer. After the landing result has appeared, a simplified Godzilla enters from the right (six seconds after touchdown), charges, and fires one 1.15-second cyan beam at 10.2 seconds after touchdown. The capsule smoothly leans 15 degrees left about its base and emits a small smoke trail. The successful result and retry button remain visible, and the mission stays won. There is no screen shake or repeated firing. The creature remains in the background afterwards.

The post-landing scene uses the pause-aware game clock, also pausing on tab hiding or orientation changes. Reduced-motion mode removes walking bob, lightning ripples and moving smoke while preserving the ending. `test-mars-coda.mjs` verifies the 20% selection threshold, central arrival, delayed entrance, one-time beam event, persistent tilt and fresh retry state. Production Canvas frames were inspected for arrival, beam and aftermath; live browser/audio checks remain unavailable.


## Crash effects and clean sharing (v9)

Impact events now carry pre-response speed and surface information. Nonfatal touchdowns at 65+ units/s produce sparks and smoke; fatal collisions produce a fireball and debris, with two detached wheels at 420+ units/s. Effects start on the impact frame and continue on the pause-aware visual clock after physics stops. Catastrophic shake lasts 0.24 seconds and is disabled for reduced-motion users. The result card waits 0.42 seconds to leave the blast visible; R and the existing Retry control remain immediate. Retry clears all effects, detached wheels and pending result timing. The marshaller keeps animating. Timeout/off-map failures do not invent an impact.

“Share how I parked” is available in the top controls and result card. A separate offscreen world render freezes the displayed pose, camera, scenery and effects, then appends the requested caption/domain. The share preview pauses play and offers PNG download, plus native file sharing when supported. Native sharing is a separate click after PNG preparation, retaining browser user activation. Object URLs are released on closing/retry; cancelling sharing is harmless.

The first space frame is retained for later flight sharing. After 45 seconds of space travel and during the capsule approach, sharing uses that earlier scene. At touchdown it changes to the classified caption over the earlier stars/car image. The exporter never invokes the destination or finale renderer, so the planet, capsule, aliens and ending remain private to gameplay. No spoiler appears in exported filenames or native-share metadata. The printed domain is user-requested branding; hosting/domain configuration is unchanged.

`test-impact-share.mjs` covers real contact events, all three effect levels, non-impact failures, expiry, reduced-motion shake, immutable capture and mission boundaries. `test-share-ui.mjs` covers PNG preparation, download fallback, native sharing, cancellation, encoding errors and closing before encoding completes using API stubs. Offscreen production Canvas QA verifies visible effects at age zero, photo composition in landscape/portrait, and identical space/approach PNGs. Live browser layout, audio and native device share dialogs still need hands-on acceptance.


## Share polish and social metadata (v10)

Share-image captions now use a taller band, a title up to 72 px, subtitle up to 36 px and a high-contrast domain up to 46 px. The photo viewport and car pose stay unchanged. The bicycle pelican is now selected on 20% of runs. After Mars touchdown the footer uses cream text and a mint expertpal link over a dark translucent pill.

Download-only browsers now request a PNG immediately within the original share-button click. PNG encoding is synchronous and the download uses a data URL, so it does not depend on a blob URL that might be revoked when the preview closes. A persistent Download PNG action and Open full-size image link remain available. Browsers with native file sharing retain the preview/choice flow. This does not override embedding/sandbox restrictions: open the game normally if an embedding host disallows downloads. The browser does not report whether an anchor download completed, so the UI says requested, not saved. Firefox/native sharing were checked through API stubs, not an actual browser session.

The HTML head includes a descriptive title, description, canonical URL, Open Graph tags, image dimensions/alt text and a large-image Twitter card. The spoiler-free generated cover is `dist/assets/social-cover-v11.png` (1731 × 909 PNG), with its prompt recorded in ART-PROMPTS.md. No bicycle pelican or secret ending appears in the cover. The shipped image is static and needs no JavaScript to be discovered.

Social metadata currently points at the existing Sites URL. Before hosting at the custom domain, run `node configure-site-url.mjs https://parkitdramatically.com/`. For GitHub Pages without that domain, pass the full Pages URL including its project subpath. Upload the complete `dist/` folder, including assets. Social crawlers need public access to the page and image; the current owner-private Sites deployment cannot provide a public social preview. This update does not change access or DNS.
