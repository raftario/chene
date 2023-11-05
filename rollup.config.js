import * as fs from "node:fs/promises"

import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import nodeExternals from "rollup-plugin-node-externals"

const ENTRYPOINTS = {
  mod: "src/mod.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
  router: "src/router.ts",
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
        outputToFilesystem: true,
        cacheDir: "node_modules/.rollup",
        tsconfig: "src/tsconfig.json",
        compilerOptions: {
          module: "Node16",
          moduleResolution: "Node16",
          declaration: true,
          declarationDir: "dist/node",
        },
      }),
      json({ preferConst: true }),
    ],
    input: { ...ENTRYPOINTS, ...NODE_ENTRYPOINTS },
    output: {
      dir: "dist/node",
      format: "es",
      sourcemap: true,
    },
  },
  // deno
  {
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        outputToFilesystem: true,
        cacheDir: "node_modules/.rollup",
        tsconfig: "src/tsconfig.json",
        compilerOptions: {
          module: "ES2022",
          moduleResolution: "Bundler",
          declaration: true,
          declarationDir: "dist/deno/d.ts",
        },
      }),
      json({ preferConst: true }),
    ],
    input: { ...ENTRYPOINTS },
    output: {
      dir: "dist/deno",
      format: "es",
      banner: (chunk) => {
        if (chunk.isEntry) {
          return `/// <reference types="./${chunk.name}.d.ts" />`
        }
      },
    },
  },
  {
    plugins: [
      dts({
        respectExternal: true,
        tsconfig: "src/tsconfig.json",
        compilerOptions: {
          module: "ES2022",
        },
      }),

      {
        name: "deno-shit",

        generateBundle(_options, bundle) {
          for (const [name, chunk] of Object.entries(bundle)) {
            if (chunk.type !== "chunk" || chunk.isEntry) continue

            this.emitFile({
              type: "prebuilt-chunk",
              fileName: name.replace(".d.ts", ".js"),
              code: `/// <reference types="./${name}" />`,
            })
          }
        },

        closeBundle: () =>
          Promise.all([
            fs.rm("dist/deno/d.ts", { recursive: true }),
            fs.cp("README.md", "dist/deno/README.md"),
            fs.cp("LICENSE.md", "dist/deno/LICENSE.md"),
          ]),
      },
    ],

    input: Object.fromEntries(
      Object.entries({ ...ENTRYPOINTS }).map(([k, v]) => [
        k,
        v.replace(".ts", ".d.ts").replace("src/", "dist/deno/d.ts/"),
      ]),
    ),
    output: {
      dir: "dist/deno",
      format: "es",
    },
  },
]
