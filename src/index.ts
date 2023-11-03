import { type AsMiddleware, type Middleware } from "./middleware.js"

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
  | Middleware<Context, Response, Response>
  | AsMiddleware<Context, Response, Response>

export * as body from "./body.js"
export { Chain } from "./chain.js"
export { type Node } from "./jsx-runtime.js"
export { logger } from "./logging.js"
export { type AsMiddleware, type Middleware } from "./middleware.js"
export * as response from "./response.js"
export { type Router, router } from "./router.js"
export { z } from "./validation.js"
