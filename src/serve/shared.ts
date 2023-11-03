import { type Context, type Handler } from "../index.js"
import { asMiddleware } from "../middleware.js"

export interface Options {
  port?: number
  hostname?: string
  signal?: AbortSignal
  onError?: (err: unknown) => void
  onListen?: (params: Context["network"]["local"]) => void
}
export interface TlsOptions extends Options {
  cert: string
  key: string
}

export interface Server {
  shutdown(): Promise<void>
  finished: Promise<void>
}
export interface V8Server extends Server {
  ref(): void
  unref(): void
}

export function withDefaults<const O extends Options>(options: O) {
  return {
    ...options,
    port: options.port ?? 0,
    hostname: options.hostname ?? "localhost",
    onError: options.onError ?? ((err) => console.error(err)),
  }
}

export function makeHandler(handler: Handler): (context: Context) => Promise<Response> {
  return (ctx) => asMiddleware(handler)(ctx, (response) => Promise.resolve(response))
}
