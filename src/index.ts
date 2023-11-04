/** @module chene */

import { type AsMiddleware, type Middleware } from "./middleware.js"

/**
 * Type which can be awaited
 *
 * @typeParam T - Result of awaiting the type
 */
export type Awaitable<T> = T | Promise<T>

/** Valid JSON values */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

/** Base input provided to the root middleware */
export interface Context {
  /** HTTP request object for the current request */
  request: Request
  /** Parsed URL for the current request */
  url: URL
  /** Network information for the current request */
  network: {
    server: {
      /** Server IP address */
      address: string
      /** Server port */
      port: number
    }
    client: {
      /** Client IP address (does not follow Forwarded headers) */
      address: string
      /** Client port (does not follow Forwarded headers) */
      port: number
    }
  }
}

/**
 * Root middleware usable as a request handler
 *
 * {@link Router} is an instance of this type.
 */
export type Handler =
  | Middleware<Context, Response, Response, Response>
  | AsMiddleware<Context, Response, Response, Response>

/** Server options */
export interface ServeOptions {
  /**
   * Port to listen on
   *
   * @defaultValue random available port
   */
  port?: number
  /**
   * Hostname or IP address or interface to listen on
   *
   * @defaultValue `"localhost"`
   */
  hostname?: string
  /** Signal usable to shutdown the server */
  signal?: AbortSignal
  /**
   * Called when an unhandled error occurs
   *
   * @defaultValue {@link console.error}
   *
   * @param error - Unhandled error
   */
  onError?: (error: unknown) => void
  /**
   * Called once the server starts listening for requests
   *
   * @param params - Server network information
   */
  onListen?: (params: Context["network"]["server"]) => void
}
/** TLS (HTTPS) server options */
export interface TlsServeOptions extends ServeOptions {
  /** TLS certificate chain in PEM format */
  cert: string
  /** TLS private key in PEM format */
  key: string
}

/** HTTP server */
export interface Server {
  /** Shuts down the server */
  shutdown(): Promise<void>
  /** Resolves once the server is shutdown and all connections closed */
  finished: Promise<void>
}
/** HTTP server on V8 */
export interface V8Server extends Server {
  /**
   * References the server within the engine
   *
   * @remarks
   *
   * The server will prevent the program from exiting until it is shutdown.
   *
   * This is the default behaviour.
   */
  ref(): void
  /**
   * Unreferences the server within the engine
   *
   * @remarks
   *
   * The server will not prevent the program from exiting even if it is not shutdown.
   */
  unref(): void
}

export * as body from "./body.js"
export * from "./chain.js"
export * from "./logging.js"
export * from "./middleware.js"
export * as response from "./response.js"
export { type Router, router } from "./router.js"
export * as url from "./url.js"
/** JSX node */
export { type VNode as Node } from "preact"
/** @see [Zod documentation](https://zod.dev) */
export { z } from "zod"
