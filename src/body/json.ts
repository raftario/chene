import { type Context } from "../index.js"
import { type Middleware } from "../middleware.js"
import { type Z, type z } from "../validation.js"
import { BodyTypeError, BodyValidationError } from "./error.js"

export function json<Ctx extends Context>(): Middleware<
  Ctx,
  Response,
  Ctx & { body: unknown }
>
export function json<Ctx extends Context, const T extends Z>(
  schema: T,
): Middleware<Ctx, Response, Ctx & { body: z.infer<T> }>
export function json<Ctx extends Context, const K extends string>(
  key: K,
): Middleware<Ctx, Response, Ctx & { [body in K]: unknown }>
export function json<Ctx extends Context, const K extends string, const T extends Z>(
  key: K,
  schema: T,
): Middleware<Ctx, Response, Ctx & { [body in K]: z.infer<T> }>

export function json(
  ...args: unknown[]
): Middleware<Context, Response, Record<string, unknown>> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "body"
  const schema = args[0] as Z | undefined

  return async (ctx, next) => {
    let body: unknown
    try {
      body = await ctx.request.json()
    } catch (err) {
      const cause = err instanceof Error ? err : undefined
      return Promise.reject(new BodyTypeError({ expected: "application/json", cause }))
    }

    if (schema) {
      const parsed = await schema.safeParseAsync(body)
      if (!parsed.success) {
        return Promise.reject(new BodyValidationError({ cause: parsed.error }))
      }
      body = parsed.data
    }

    return next({ ...ctx, [key]: body })
  }
}
