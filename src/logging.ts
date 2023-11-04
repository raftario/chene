import { type Context } from "./index.js"
import { type Middleware } from "./middleware.js"

/** Logger middleware options */
export interface LoggerOptions {
  /** Whether to include the timestamp in the log message */
  timestamp?: boolean
  /** Whether to include the latency in the log message */
  latency?: boolean
}

/**
 * Logger middleware factory
 *
 * @param options - Options for the returned middleware
 * @returns A request logger middleware
 *
 * @example Create an app that logs requests and their latency
 * ```ts
 * const app = router(logger({ latency: true }))
 * ```
 */
export function logger<I extends Context>(
  options: LoggerOptions = {},
): Middleware<I, Response, I, Response> {
  return async (input, next) => {
    const timestamp = new Date()

    const start = performance.now()
    const response = await next(input)
    const end = performance.now()

    const method = input.request.method
    const status = response.status

    let message = ""
    if (options.timestamp) {
      message += `${timestamp.toISOString()} `
    }
    message += `${method} ${input.url.pathname}${input.url.search} ${status}`
    if (options.latency) {
      message += ` ${(end - start).toFixed(3)}ms`
    }
    console.log(message)

    return response
  }
}
