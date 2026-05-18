#!/usr/bin/env node
// Thin shim that delegates to the built CLI.
import("../dist/cli.js")
  .then(({ run }) => run(process.argv.slice(2)))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
