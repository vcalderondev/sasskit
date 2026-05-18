// =============================================================================
// CLI
// -----------------------------------------------------------------------------
// Tiny argv parser + two commands:
//   sasskit build [--config path] [--content glob...] [--output file] [--minify]
//   sasskit watch [--config path] [--content glob...] [--output file] [--minify]
//
// Designed to be invoked through the `bin/sasskit.mjs` shim.
// =============================================================================

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import kleur from "kleur"
import { findConfigFile, loadConfigFile, resolveConfig } from "./core/config.js"
import { Engine, build } from "./core/engine.js"
import type { SasskitConfig } from "./core/types.js"

interface Argv {
  command: "build" | "watch" | "help" | "version"
  config?: string
  content?: string[]
  output?: string
  minify?: boolean
}

function parseArgv(argv: readonly string[]): Argv {
  const out: Argv = { command: "help" }
  if (argv.length === 0) return out
  const [cmd, ...rest] = argv
  if (cmd === "--version" || cmd === "-v") return { command: "version" }
  if (cmd === "--help" || cmd === "-h" || cmd === "help") return { command: "help" }
  if (cmd !== "build" && cmd !== "watch") {
    console.error(kleur.red(`Unknown command: ${cmd}`))
    return { command: "help" }
  }
  out.command = cmd
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    const next = rest[i + 1]
    if (a === "--config" || a === "-c") {
      out.config = next
      i++
    } else if (a === "--content") {
      out.content = out.content ?? []
      out.content.push(next!)
      i++
    } else if (a === "--output" || a === "-o") {
      out.output = next
      i++
    } else if (a === "--minify" || a === "-m") {
      out.minify = true
    } else if (a === "--help" || a === "-h") {
      out.command = "help"
      return out
    } else {
      console.error(kleur.red(`Unknown flag: ${a}`))
    }
  }
  return out
}

function printHelp(): void {
  console.log(`${kleur.bold("sasskit")} — JIT utility-first CSS engine

${kleur.bold("Usage")}
  sasskit build [options]
  sasskit watch [options]

${kleur.bold("Options")}
  -c, --config <path>     Path to sasskit.config.{js,mjs,cjs,json}
      --content <glob>    Source glob to scan (repeatable). Overrides config.
  -o, --output <file>     Output CSS path. Defaults to stdout.
  -m, --minify            Minify the output CSS.
  -h, --help              Show this help.
  -v, --version           Print the version.

${kleur.bold("Examples")}
  sasskit build -o dist/app.css
  sasskit build --content "src/**/*.{html,tsx,vue}" -o dist/app.css --minify
  sasskit watch -o dist/app.css
`)
}

async function loadUserConfig(cwd: string, explicit?: string): Promise<SasskitConfig> {
  const file = findConfigFile(cwd, explicit)
  if (!file) return {}
  return loadConfigFile(file)
}

async function writeOutput(css: string, output: string | null): Promise<void> {
  if (!output) {
    process.stdout.write(css)
    return
  }
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, css, "utf8")
}

function applyCliOverrides(base: SasskitConfig, argv: Argv): SasskitConfig {
  const merged: SasskitConfig = { ...base }
  if (argv.content && argv.content.length > 0) merged.content = argv.content
  if (argv.output) merged.output = argv.output
  if (argv.minify) merged.minify = true
  return merged
}

async function cmdBuild(argv: Argv): Promise<number> {
  const cwd = process.cwd()
  const userConfig = await loadUserConfig(cwd, argv.config)
  const merged = applyCliOverrides(userConfig, argv)
  const start = Date.now()
  const result = await build(merged, cwd)
  const config = resolveConfig(merged, cwd)
  await writeOutput(result.css, config.output)
  const took = Date.now() - start
  console.error(
    kleur.green("✓") +
      kleur.dim(
        ` matched ${result.matchedClasses.length} classes / ${result.candidateCount} candidates / ${result.scannedFiles.length} files in ${took} ms`,
      ),
  )
  if (config.output) {
    console.error(kleur.dim(`  → ${path.relative(cwd, config.output)}`))
  }
  return 0
}

async function cmdWatch(argv: Argv): Promise<number> {
  const cwd = process.cwd()
  const userConfig = await loadUserConfig(cwd, argv.config)
  const merged = applyCliOverrides(userConfig, argv)
  const engine = new Engine(merged, cwd)
  const config = engine.getConfig()
  if (!config.output) {
    console.error(kleur.red("watch mode requires an --output path"))
    return 1
  }

  const files = await engine.scanAll()
  const rebuild = async (label: string) => {
    const start = Date.now()
    const result = engine.build()
    await writeOutput(result.css, config.output)
    console.error(
      kleur.green("✓") +
        kleur.dim(
          ` ${label} → ${result.matchedClasses.length} classes / ${result.scannedFiles.length} files / ${Date.now() - start} ms`,
        ),
    )
  }
  await rebuild("initial build")

  const { default: chokidar } = await import("chokidar")
  const watcher = chokidar.watch(config.content, {
    cwd,
    ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
    ignoreInitial: true,
  })
  watcher.on("add", async (rel) => {
    const file = path.resolve(cwd, rel)
    await engine.refreshFile(file)
    await rebuild(`+ ${rel}`)
  })
  watcher.on("change", async (rel) => {
    const file = path.resolve(cwd, rel)
    await engine.refreshFile(file)
    await rebuild(`~ ${rel}`)
  })
  watcher.on("unlink", async (rel) => {
    const file = path.resolve(cwd, rel)
    engine.forgetFile(file)
    await rebuild(`- ${rel}`)
  })

  console.error(
    kleur.dim(`watching ${files.length} files across ${config.content.length} pattern(s)…`),
  )
  // Keep the process alive.
  await new Promise(() => {})
  return 0
}

async function readPkgVersion(): Promise<string> {
  // Best-effort: try to read package.json from a few likely locations.
  // tsup bundles cli.ts into dist/cli.js, so __dirname-style lookup works
  // from there at runtime.
  try {
    const url = new URL("../package.json", import.meta.url)
    const { readFile } = await import("node:fs/promises")
    const text = await readFile(url, "utf8")
    return JSON.parse(text).version ?? "unknown"
  } catch {
    return "unknown"
  }
}

export async function run(argv: readonly string[]): Promise<number> {
  const parsed = parseArgv(argv)
  switch (parsed.command) {
    case "build":
      return cmdBuild(parsed)
    case "watch":
      return cmdWatch(parsed)
    case "version": {
      const version = await readPkgVersion()
      console.log(version)
      return 0
    }
    case "help":
    default:
      printHelp()
      return 0
  }
}
