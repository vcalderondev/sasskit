# @vcalderondev/sasskit

The definitive utility-first SASS toolkit for modern web development. Unified ruleset for layout, positioning, spacing, typography, borders and basic animations — every utility ships with mobile and tablet responsive variants out of the box.

## Installation

```bash
npm install @vcalderondev/sasskit
```

## Usage

Import the entry point from your main SASS file:

```sass
@use "@vcalderondev/sasskit" as rules
```

That single import re-exports every module (`variables`, `mixins`, `base`, `layout`, `display`, `spacing`, `typography`, `keyframes`, `borders`, `grid`).

## Features

- **Utility-first**: inspired by Tailwind, built with pure SASS power.
- **Responsive-ready**: every utility ships with `-m` (mobile) and `-t` (tablet) variants.
- **Modern SASS**: uses SASS modules (`@use`, `@forward`) and the modern built-in modules (`sass:string`, `sass:map`, `sass:list`).
- **Comprehensive coverage**: layout, spacing, typography, borders, display, sizing, animations.
- **Tweakable**: every scale and named map is overridable via `@use ... with (...)`.

## Responsive convention

Almost every utility class ships in three variants:

| Suffix   | Active when                  | Example     |
| -------- | ---------------------------- | ----------- |
| *(none)* | Always                       | `.d-flex`   |
| `-m`     | viewport ≤ `$mobile` (576px) | `.d-flex-m` |
| `-t`     | viewport ≤ `$tablet` (992px) | `.d-flex-t` |

Breakpoints live in `_variables.sass` (`$mobile`, `$tablet`, `$desktop`) and can be overridden by re-declaring them before importing the package.

## Base reset & stateless helpers (`_base.sass`)

A light CSS reset is applied automatically: universal `box-sizing: border-box`, zero margin/padding on `html`/`body`, font smoothing on macOS, list-style removed, anchors inherit color, native button chrome cleared, responsive `img`/`video`.

### Background resets

| Class             | Effect                  |
| ----------------- | ----------------------- |
| `.bg-transparent` | `background: transparent` |
| `.bg-none`        | `background: none`      |

Both ship with `-m` / `-t` responsive variants.

### Cursor utilities

`.cursor-{value}` for every keyword in `$cursors`: `pointer, default, move, not-allowed, help, wait, text, grab, grabbing, zoom-in, zoom-out`. All with `-m` / `-t`.

## Display

| Class             | Effect                                |
| ----------------- | ------------------------------------- |
| `.d-flex`         | `display: flex`                       |
| `.d-grid`         | `display: grid`                       |
| `.d-block`        | `display: block`                      |
| `.d-inline`       | `display: inline`                     |
| `.d-inline-block` | `display: inline-block`               |
| `.d-inline-flex`  | `display: inline-flex`                |
| `.d-inline-grid`  | `display: inline-grid`                |
| `.d-none`         | `display: none`                       |
| `.d-{value}-i`    | Same as `.d-{value}` but `!important` |

Responsive variants: `.d-flex-m`, `.d-none-t`, etc.

## Spacing (margin / padding / gap)

Units: `rem`, `px`, `em`. `gap` only ships in the `px` scale.

### Scales

- **rem:** `0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5`.
- **px (1px granularity 0–25, then jumps):** `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 30, 32, 35, 40, 45, 48, 50, 60, 64, 80, 100`.
- **em:** `1, 1.5, 2`.

### Naming convention

```
{prop}{dir?}-{value}[-{unit}][-{breakpoint}]
```

- `prop`: `m` (margin) · `p` (padding) · `gap`
- `dir`: `t` top · `b` bottom · `s` inline-start · `e` inline-end · `x` horizontal · `y` vertical (optional)
- `unit`: `rem` · `px` · `em`
- `breakpoint`: `m` mobile · `t` tablet (optional)

### Examples

| Class        | Result                             |
| ------------ | ---------------------------------- |
| `.m-1-rem`   | `margin: 1rem`                     |
| `.m-0-5-rem` | `margin: 0.5rem`                   |
| `.m-10px`    | `margin: 10px`                     |
| `.m-1-em`    | `margin: 1em`                      |
| `.pt-16px`   | `padding-top: 16px`                |
| `.mx-2-rem`  | `margin-left/right: 2rem`          |
| `.py-1-rem`  | `padding-top/bottom: 1rem`         |
| `.gap-8px`   | `gap: 8px`                         |
| `.m-1-rem-m` | `margin: 1rem` on mobile only      |
| `.pt-16px-t` | `padding-top: 16px` on tablet only |

### Legacy aliases (no unit suffix)

Every spacing class also has a short alias without the unit suffix:

```
.p-1     // padding: 1em (em overrides earlier scales)
.pt-1    // padding-top: 1em
.px-1    // padding-left/right: 1em
```

Prefer the explicit `-rem` / `-px` / `-em` variants in new code.

### Auto margins

`.m-auto`, `.mt-auto`, `.mb-auto`, `.ms-auto`, `.me-auto`, `.mx-auto`, `.my-auto` — all with `-m` / `-t` responsive variants.

## Typography

### Font-size

```
.fs-{value}[-{unit}][-{breakpoint}]
```

- **px scale:** `10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64`.
- **rem scale (25 values, fine-grained):** `0.5, 0.6, 0.65, 0.7, 0.75, 0.78, 0.8, 0.85, 0.875, 0.9, 0.95, 1, 1.1, 1.2, 1.25, 1.3, 1.4, 1.5, 1.75, 1.8, 2, 2.5, 3, 4, 5`.
- **em scale:** `1, 1.2, 1.5, 2`.

| Class           | Result                        |
| --------------- | ----------------------------- |
| `.fs-15px`      | `font-size: 15px`             |
| `.fs-1-rem`     | `font-size: 1rem`             |
| `.fs-0-875-rem` | `font-size: 0.875rem`         |
| `.fs-1-2-em`    | `font-size: 1.2em`            |
| `.fs-16px-m`    | mobile-only `font-size: 16px` |

The rem scale also exposes legacy aliases without the unit suffix: `.fs-1`, `.fs-1-5`, etc.

### Font-weight

`.fw-100` ... `.fw-900`, plus `.fw-bold`, `.fw-normal`. All with `-m` / `-t` variants.

### Alignment / Transformation

`.text-left`, `.text-center`, `.text-right`, `.text-justify` (with `-m` / `-t`).
`.text-uppercase`, `.text-lowercase`, `.text-capitalize`, `.text-none` (with `-m` / `-t`).

### Line-height

`.lh-1` ... `.lh-4` and half steps `.lh-1-5` ... `.lh-4-5` (with `-m` / `-t`).

### White-space

`.ws-nowrap`, `.ws-normal`, `.ws-pre` (with `-m` / `-t`).

### Text overflow

`.text-ellipsis` — single-line ellipsis combo (`overflow: hidden` + `text-overflow: ellipsis` + `white-space: nowrap`). Has `-m` / `-t` variants.

### Letter-spacing

Positive and negative scales, both in `px` and `em`. Negative variants are prefixed with `neg-` (selectors can't start with `-`).

- **px (positive):** `.letter-spacing-1px` ... `.letter-spacing-10px`.
- **px (negative):** `.letter-spacing-neg-1px` ... `.letter-spacing-neg-10px`.
- **em (positive):** `.letter-spacing-0-01-em`, `0-02-em`, `0-05-em`, `0-1-em`, `0-15-em`, `0-2-em`.
- **em (negative):** `.letter-spacing-neg-0-01-em`, ..., `.letter-spacing-neg-0-2-em`.

All with `-m` / `-t` variants.

## Sizing (width / height)

### Percentage scale

`.w-{n}` and `.h-{n}` where `n` ∈ `0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100` — emit `width` / `height` in `%`. Both have `-m` / `-t` variants.

### Content-driven

`.w-max-content` (with `-m` / `-t`).

### Viewport-relative scale (`vw` / `vh`)

`.w-{n}vw` and `.h-{n}vh` where `n` ∈ `10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100`. Useful for hero sections, sticky drawers, full-bleed banners.

`.w-100vw` and `.h-100vh` still ship as standalone aliases (identical to the scale entries).

All viewport classes have `-m` / `-t` variants.

### Fixed pixel sizes

`.w-{n}px`, `.h-{n}px`, `.min-w-{n}px`, `.min-h-{n}px` for:

- Every integer from 1 to 64.
- Common large sizes: 80, 100, 120, 140, 160, 180, 200, 240, 280, 300, 320, 360, 400, 450, 480, 500, 550, 600, 700, 750, 800.

All have `-m` / `-t` variants.

## Positioning & transforms (`_layout.sass`)

### Offsets

`.top-0`, `.bottom-0`, `.left-0`, `.right-0` and centered helpers `.top-50-percent`, `.left-50-percent`. The 50% offsets pair naturally with the transform helpers below to achieve absolute centering.

Pixel offsets (driven by `$right-px-values` and `$bottom-px-values`):

- **Right:** `.right-4px`, `.right-6px`, `.right-8px`, `.right-12px`.
- **Bottom:** `.bottom-16px`, `.bottom-32px`, `.bottom-40px`.

### Transforms

| Class                                       | Effect                                 |
| ------------------------------------------- | -------------------------------------- |
| `.translate-x-center` / `.translate-x-neg-50` | `translateX(-50%)` (canonical + alias) |
| `.translate-y-center` / `.translate-y-neg-50` | `translateY(-50%)` (canonical + alias) |
| `.translate-center`                         | `translate(-50%, -50%)` (XY centering) |
| `.transform-none`                           | Clears any existing `transform`        |
| `.rotate-90`                                | `rotate(90deg)`                        |

Typical pattern for centered absolute elements:

```html
<div class="position-relative">
  <div class="position-absolute top-50-percent left-50-percent translate-center">
    Perfectly centered
  </div>
</div>
```

All layout utilities have `-m` / `-t` responsive variants.

## Position keyword

`.position-relative`, `.position-absolute`, `.position-fixed`, `.position-sticky` (with `-m` / `-t`).

## Flexbox

### Alignment

`.align-items-{value}`, `.align-self-{value}`, `.align-content-{value}` where `value` ∈ `center, start, end, baseline, stretch`. `flex-start` and `flex-end` are aliased to `start` / `end`. All have `-m` / `-t`.

### Justification

`.justify-content-{value}`, `.justify-items-{value}`, `.justify-self-{value}` where `value` ∈ `center, right, left, start, end, space-between, space-around, space-evenly`. All have `-m` / `-t`.

### Flex helpers

- `.flex-0`, `.flex-1`, `.flex-none` — with `-m` / `-t`.
- `.flex-grow-0`, `.flex-grow-1`, `.flex-shrink-0`, `.flex-shrink-1` — with `-m` / `-t`.
- `.flex-nowrap`, `.flex-wrap`, `.flex-wrap-reverse` — with `-m` / `-t`.
- `.flex-direction-row`, `.flex-direction-row-reverse`, `.flex-direction-column`, `.flex-direction-column-reverse` — with `-m` / `-t`.

## Object-fit

`.object-cover`, `.object-contain` (with `-m` / `-t`).

## Overflow

`.overflow-{value}`, `.overflow-x-{value}`, `.overflow-y-{value}` where `value` ∈ `auto, hidden, scroll, visible`. All with `-m` / `-t`.

## Opacity

`.opacity-{n}` where `n` ∈ `0, 2, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 100` — emits `opacity: n / 100`. Includes fine-grained low values (`2`, `4`, `15`, `85`) for subtle disabled or overlay states. With `-m` / `-t`.

## Z-index

Three tiers, all with `-m` / `-t` variants:

- **Units:** `.z-1` ... `.z-10`.
- **Decades:** `.z-10`, `.z-20`, ..., `.z-100`.
- **Extreme layers:** `.z-500`, `.z-1000`, `.z-2000`, `.z-5000`, `.z-9999` — for modals, toasts and overlay stacks that must beat anything below.

## Borders (`_borders.sass`)

### Border radius (px)

Full radius:

- `.border-radius-{n}px` and the alias `.rounded-{n}px` for `n` ∈ `0, 1, 2, 4, 6, 8, 10, 11, 12, 14, 16, 20, 24, 28, 30, 32, 40`.

Directional radii (round only one side of the box):

| Class                                         | Affects                                            |
| --------------------------------------------- | -------------------------------------------------- |
| `.border-radius-t-{n}px` / `.rounded-t-{n}px` | top-left + top-right                               |
| `.border-radius-b-{n}px` / `.rounded-b-{n}px` | bottom-left + bottom-right                         |
| `.border-radius-l-{n}px` / `.rounded-l-{n}px` | top-left + bottom-left                             |
| `.border-radius-r-{n}px` / `.rounded-r-{n}px` | top-right + bottom-right                           |

All radii — full and directional — ship with `-m` / `-t` responsive variants.

### Border radius (named)

| Class                 | Value    |
| --------------------- | -------- |
| `.rounded-xs`         | `2px`    |
| `.rounded-sm`         | `4px`    |
| `.rounded-md`         | `8px`    |
| `.rounded-lg`         | `12px`   |
| `.rounded-xl`         | `16px`   |
| `.rounded-2xl`        | `24px`   |
| `.rounded-full`       | `9999px` |
| `.rounded-50-percent` | `50%`    |

(`.border-radius-{name}` is the equivalent long form.)

### Applied borders (themed)

`.border` and the per-side helpers `.border-t`, `.border-b`, `.border-l`, `.border-r`, `.border-s`, `.border-e` apply a `1px solid var(--border)` border. The consuming project must declare `--border` in its theme (light / dark / etc.).

```css
:root { --border: #e5e7eb; }
[data-theme="dark"] { --border: #1f2937; }
```

Responsive variants:

- Per-side classes have `-m` / `-t` variants (`.border-t-m`, `.border-l-t`, ...).
- `.border` (all sides) only has the mobile variant `.border-m`. The tablet name `.border-t` is intentionally taken by the top-side helper; for tablet-only borders, compose `.border-{side}-t` per side.

### Border styles (clearing)

`.border-none`, `.border-transparent`, plus per-side helpers `.border-t-none`, `.border-b-none`, `.border-l-none`, `.border-r-none`, `.border-s-none`, `.border-e-none`.

All have `-m` / `-t` variants.

## Grid (`_grid.sass`)

CSS Grid helpers. All ship with `-m` / `-t` responsive variants so layouts can collapse to a single column at smaller viewports.

### Columns

| Class               | Effect                                                                |
| ------------------- | --------------------------------------------------------------------- |
| `.grid-cols-{1–12}` | `display: grid` + `grid-template-columns: repeat(N, minmax(0, 1fr))`  |
| `.grid-col-span-{1–12}` | `grid-column: span N / span N`                                    |
| `.grid-col-span-full`   | `grid-column: 1 / -1` (full width)                                |

### Rows

| Class                | Effect                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `.grid-rows-{1–6}`   | `display: grid` + `grid-template-rows: repeat(N, minmax(0, 1fr))`   |
| `.grid-row-span-{1–6}` | `grid-row: span N / span N`                                       |
| `.grid-row-span-full`  | `grid-row: 1 / -1`                                                |

### Auto-flow

| Class                  | `grid-auto-flow` value |
| ---------------------- | ---------------------- |
| `.grid-flow-row`       | `row`                  |
| `.grid-flow-col`       | `column`               |
| `.grid-flow-dense`     | `dense`                |
| `.grid-flow-row-dense` | `row dense`            |
| `.grid-flow-col-dense` | `column dense`         |

### Common patterns

```html
<!-- 3 columns on desktop, 1 on mobile -->
<div class="grid-cols-3 grid-cols-1-m">
  <div>A</div><div>B</div><div>C</div>
</div>

<!-- Hero card that spans the full grid row -->
<div class="grid-cols-4">
  <div class="grid-col-span-full">Hero</div>
  <div>1</div><div>2</div><div>3</div><div>4</div>
</div>
```

## Animations (`_keyframes.sass`)

| Keyframe       | Helper class          | Description                        |
| -------------- | --------------------- | ---------------------------------- |
| `fadeIn`       | `.animate-fade-in`    | Opacity 0 → 1 over 0.3s            |
| `fadeInUp`     | `.animate-fade-in-up` | Fade + slight upward translate     |
| `fadeInScale`  | *(keyframe only)*     | Fade + scale up (combine yourself) |
| `slideInRight` | *(keyframe only)*     | Slide from the right               |
| `spin`         | `.animate-spin`       | Endless rotation                   |
| `pulse`        | `.animate-pulse`      | Soft opacity + scale pulse         |

## Tokens at a glance

These are the lists that drive class generation — override them via `@use ... with` if you need different values.

| Token                     | Where             | Default                                                    |
| ------------------------- | ----------------- | ---------------------------------------------------------- |
| `$mobile`                 | `_variables.sass` | `576px`                                                    |
| `$tablet`                 | `_variables.sass` | `992px`                                                    |
| `$desktop`                | `_variables.sass` | `1200px`                                                   |
| `$sizes` (w / h %)        | `_variables.sass` | `0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100`|
| `$opacities`              | `_variables.sass` | `0, 2, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 85, 90, 100` |
| `$overflows`              | `_variables.sass` | `auto, hidden, scroll, visible`                            |
| `$border-radius-px`       | `_variables.sass` | `0, 1, 2, 4, 6, 8, 10, 11, 12, 14, 16, 20, 24, 28, 30, 32, 40` |
| `$border-radius-named`    | `_variables.sass` | `xs: 2, sm: 4, md: 8, lg: 12, xl: 16, 2xl: 24, full: 9999` |
| `$cursors`                | `_variables.sass` | `pointer, default, move, not-allowed, help, wait, text, grab, grabbing, zoom-in, zoom-out` |
| `$viewport-sizes` (vw/vh) | `_display.sass`   | `10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100`      |
| `$extreme-z` (z-index)    | `_display.sass`   | `500, 1000, 2000, 5000, 9999`                              |
| `$right-px-values`        | `_layout.sass`    | `4, 6, 8, 12`                                              |
| `$bottom-px-values`       | `_layout.sass`    | `16, 32, 40`                                               |

## Customising

All scales and named maps live in `_variables.sass`. Re-declare them with `@use ... with (...)` before forwarding the rest of the library if you need to customise breakpoints, named radii, opacity steps, etc.

```sass
@use "@vcalderondev/sasskit/src/variables" with (
  $mobile: 640px,
  $tablet: 1024px
)
@use "@vcalderondev/sasskit"
```

## License

MIT — Victor Calderon <mail@vcalderon.dev>
