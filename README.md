# @vcalderondev/ukit-css

JIT utility-first CSS engine — Tailwind-style on-demand class generation for any frontend stack (React, Vue, Angular, Svelte, Next.js, Astro, plain HTML).

`ukit-css` is a powerful Node + TypeScript engine that scans your source files, extracts the classes you actually use, and emits **only those** as CSS. It supports rich utility class names (`m-1-rem`, `grid-cols-3-m`, `rounded-lg`, `text-ellipsis-3`, …) while dropping your bundle size to the absolute minimum.

## Why JIT?

| Mode                    | Output                        | Notes                                                |
| ----------------------- | ----------------------------- | ---------------------------------------------------- |
| Legacy (Static CSS)      | ~770 KB compiled & minified   | Every utility shipped, used or not                   |
| JIT (ukit-css)          | typically 2–30 KB per project | Only the classes you actually reference              |

In a real project that uses 46 distinct utilities across HTML/JSX/Vue templates, the engine emits ~2.4 KB minified — a **99.7% reduction** versus static utility libraries.

## Installation

```bash
npm install -D @vcalderondev/ukit-css
```

## Quick start (CLI)

Create a configuration file at the root of your project:

```js
// ukit.config.mjs
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte,astro}"],
  output: "./dist/ukit.css",
}
```

Then build:

```bash
npx ukit-css build
```

Or watch for changes during development:

```bash
npx ukit-css watch
```

Add `--minify` for production builds, `--output` to override the destination, or `--content` to override globs from the command line.

## Integration recipes

### Vite (React / Vue / Svelte / vanilla)

```ts
// vite.config.ts
import { defineConfig } from "vite"
import ukit from "@vcalderondev/ukit-css/vite"

export default defineConfig({
  plugins: [ukit()],
})
```

```ts
// main.ts (or main.tsx)
import "virtual:ukit.css"
```

HMR is wired in: every time you touch a content file, the virtual stylesheet rebuilds and hot-reloads instantly.

### PostCSS (Next.js, Angular, Nuxt, Astro, Webpack, anywhere)

```js
// postcss.config.mjs
import ukit from "@vcalderondev/ukit-css/postcss"

export default {
  plugins: [ukit()],
}
```

```css
/* src/styles/app.css */
@ukit;
```

The `@ukit;` at-rule is expanded to the JIT output. If you omit it, the plugin prepends the CSS to the entry file automatically.

### Next.js (without a custom PostCSS plugin)

Use the CLI in a script and import the generated file:

```json
// package.json
{
  "scripts": {
    "css:build": "ukit-css build -o app/ukit.css --minify",
    "css:dev":   "ukit-css watch -o app/ukit.css"
  }
}
```

```tsx
// app/layout.tsx
import "./ukit.css"
```

### Angular

```json
// angular.json (excerpt)
{
  "styles": ["src/ukit.css", "src/styles.scss"]
}
```

```bash
# during development
npx ukit-css watch -o src/ukit.css
# before production build
npx ukit-css build -o src/ukit.css --minify
```

### Plain HTML

```bash
npx ukit-css build --content "./public/**/*.html" -o ./public/ukit.css --minify
```

```html
<link rel="stylesheet" href="/ukit.css" />
```

---

## Configuration

```ts
// ukit.config.mjs (or .js / .cjs / .json)
import { defineConfig } from "@vcalderondev/ukit-css"

export default defineConfig({
  // Globs scanned for class candidates. The engine reads each file as text
  // and pulls out any token that could be a utility class — so it works with
  // Angular [class.x], Vue :class, React clsx(), Svelte class:foo, etc.
  content: ["./src/**/*.{html,ts,tsx,vue,svelte}"],

  // Output path (used by the CLI). Plugins ignore this.
  output: "./dist/app.css",

  // Breakpoint overrides.
  mobile: 576,
  tablet: 992,
  desktop: 1200,

  // Toggle the CSS reset + the keyframes block.
  preflight: true,
  keyframes: true,

  // Class names to always include even if they don't appear in source files
  // (useful for classes that are composed dynamically: `m-${size}-rem`, etc.).
  safelist: ["m-1-rem", "m-2-rem", "m-3-rem"],

  // Minify the output.
  minify: false,
})
```

---

## Utility reference

Every utility ships with a base, `-m` (mobile, ≤ 576 px) and `-t` (tablet, 577–992 px) variant.

| Category   | Examples                                                                  |
| ---------- | ------------------------------------------------------------------------- |
| Display    | `d-flex`, `d-grid`, `d-none-m`                                            |
| Sizing     | `w-50`, `h-100vh`, `min-w-200px`, `max-w-90`                              |
| Spacing    | `m-1-rem`, `pt-16px`, `gap-1-5-rem`, `mx-auto`                            |
| Position   | `position-absolute`, `top-50-percent`, `left-50-percent`, `translate-center` |
| Flex       | `align-items-center`, `justify-content-between`, `flex-direction-column`  |
| Typography | `fs-1-rem`, `fw-700`, `text-center`, `lh-1-5`, `text-ellipsis-3`          |
| Borders    | `rounded-lg`, `rounded-r-12px`, `border`, `border-t`, `border-none`       |
| Grid       | `grid-cols-3`, `grid-cols-1-m`, `grid-col-span-2`, `grid-row-span-full`   |
| Z-index    | `z-1`, `z-50`, `z-9999`                                                   |
| Opacity    | `opacity-50`, `opacity-0`                                                 |
| Overflow   | `overflow-hidden`, `overflow-x-auto`                                      |
| Animate    | `animate-fade-in`, `animate-fade-in-up`, `animate-spin`, `animate-pulse`  |

Naming convention (spacing): `{prop}{dir?}-{value}[-{unit}][-{breakpoint}]`. Example: `pt-1-5-rem-m` → `padding-top: 1.5rem` on mobile.

For the full vocabulary refer to the matchers in `src/core/matchers/` — each file documents the patterns it recognizes.

---

## Programmatic API

```ts
import { build, Engine, defineConfig } from "@vcalderondev/ukit-css"

// One-shot build
const { css, matchedClasses } = await build({
  content: ["./src/**/*.tsx"],
})

// Long-lived engine (incremental rebuilds, watch mode, plugins)
const engine = new Engine({ content: ["./src/**/*.tsx"] })
await engine.scanAll()
const { css: output } = engine.build()
```

## License

MIT — Victor Calderon <mail@vcalderon.dev>
