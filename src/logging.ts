import { type Context } from "./index.js"
import { type Middleware } from "./middleware.js"

export function logger<Ctx extends Context>(
  options: { timestamp?: boolean; latency?: boolean } = {},
): Middleware<Ctx, Response, Ctx> {
  return async (ctx, next) => {
    const timestamp = new Date()

    const start = performance.now()
    const response = await next(ctx)
    const end = performance.now()

    const method = ctx.request.method
    const status = response.status

    let message = ""
    if (options.timestamp) {
      message += `${timestamp.toISOString()} `
    }
    message += `${method} ${ctx.url.pathname}${ctx.url.search} ${status}`
    if (options.latency) {
      message += ` ${(end - start).toFixed(3)}ms`
    }
    console.log(message)

    return response
  }
}
