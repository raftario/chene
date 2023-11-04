/** @module chene */

import { type AsMiddleware, type Middleware } from "./middleware.js"

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

export interface Context {
  request: Request
  url: URL
  network: {
    local: {
      address: string
      port: number
    }
    peer: {
      address: string
      port: number
    }
  }
}

export type Handler =
  | Middleware<Context, Response, Response, Response>
  | AsMiddleware<Context, Response, Response, Response>

export interface ServeOptions {
  port?: number
  hostname?: string
  signal?: AbortSignal
  onError?: (err: unknown) => void
  onListen?: (params: Context["network"]["local"]) => void
}
export interface TlsServeOptions extends ServeOptions {
  cert: string
  key: string
}

export * as body from "./body.js"
export * from "./chain.js"
export * from "./logging.js"
export * from "./middleware.js"
export * as response from "./response.js"
export { type Router, router } from "./router.js"
export * as url from "./url.js"
export { type VNode as Node } from "preact"
export { z } from "zod"
