import * as fs from "node:fs/promises"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const PREACT_D_TS = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "node_modules",
  "preact",
  "src",
  "index.d.ts",
)

const source = await fs.readFile(PREACT_D_TS, "utf-8")
const transformed = source.replaceAll(
  "export import JSX = JSXInternal",
  "export { JXSInternal as JSX }",
)
await fs.writeFile(PREACT_D_TS, transformed)
