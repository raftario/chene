import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import nodeExternals from "rollup-plugin-node-externals"

const ENTRYPOINTS = {
  index: "src/index.ts",
  body: "src/body.ts",
  chain: "src/chain.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
  logging: "src/logging.ts",
  middleware: "src/middleware.ts",
  response: "src/response.ts",
  router: "src/router.ts",
  url: "src/url.ts",
  validation: "src/validation.ts",
}
const NODE_ENTRYPOINTS = {
  node: "src/node.ts",
  otel: "src/otel.ts",
}

export default [
  // node
  {
    plugins: [
      nodeExternals({ deps: true, peerDeps: true, devDeps: false }),
      typescript({
        compilerOptions: { declaration: true, declarationDir: "dist/node" },
      }),
      json({ preferConst: true }),
    ],
    input: { ...ENTRYPOINTS, ...NODE_ENTRYPOINTS },
    output: [
      {
        dir: "dist/node",
        format: "es",
        sourcemap: true,
      },
    ],
  },
  // deno
  {
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        compilerOptions: { declaration: true, declarationDir: "dist/deno" },
      }),
      json({ preferConst: true }),
    ],
    input: { ...ENTRYPOINTS },
    output: [
      {
        dir: "dist/deno",
        format: "es",
      },
    ],
  },
]
