import { type Context, type Handler, type ServeOptions } from "../index.js"
import { asMiddleware } from "../middleware.js"

export interface Server {
  shutdown(): Promise<void>
  finished: Promise<void>
}
export interface V8Server extends Server {
  ref(): void
  unref(): void
}

export function withDefaults<const O extends ServeOptions>(options: O) {
  return {
    ...options,
    port: options.port ?? 0,
    hostname: options.hostname ?? "localhost",
    onError: options.onError ?? ((err) => console.error(err)),
  }
}

export function makeHandler(handler: Handler): (input: Context) => Promise<Response> {
  return (input) =>
    asMiddleware(handler)(input, (response) => Promise.resolve(response))
}
