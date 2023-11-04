import { asMiddleware } from "../middleware.js"
import { type Context, type Handler, type ServeOptions } from "../mod.js"

export function withDefaults<const O extends ServeOptions>(options: O) {
  return {
    ...options,
    port: options.port ?? 0,
    hostname: options.hostname ?? "localhost",
    onError: options.onError ?? console.error,
  }
}

export function makeHandler(handler: Handler): (input: Context) => Promise<Response> {
  return (input) =>
    asMiddleware(handler)(input, (response) => Promise.resolve(response))
}
