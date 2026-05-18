// =============================================================================
// PUBLIC API
// -----------------------------------------------------------------------------
// Re-exports the high-level engine + types so consumers can do:
//
//   import { build, Engine, defineConfig } from "@vcalderondev/ukit-css"
// =============================================================================

export { build, buildFromCandidates, Engine } from "./core/engine.js"
export type { BuildResult } from "./core/engine.js"
export { resolveConfig, findConfigFile, loadConfigFile } from "./core/config.js"
export { matchCandidate } from "./core/matchers/index.js"
export type {
  Breakpoint,
  Declarations,
  GeneratedRule,
  MatchResult,
  ResolvedConfig,
  UkitConfig,
} from "./core/types.js"

import type { UkitConfig } from "./core/types.js"

/** Identity helper for typed config files (`ukit.config.js`). */
export function defineConfig(config: UkitConfig): UkitConfig {
  return config
}
