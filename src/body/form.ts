import * as ct from "content-type"

import { type Context } from "../index.js"
import { type Middleware } from "../middleware.js"
import { type z, type ZFromStringsMap } from "../validation.js"
import { fromStringsMap } from "../validation/string.js"
import { BodyTypeError, BodyValidationError } from "./error.js"

const CONTENT_TYPE = "application/x-www-form-urlencoded"

export function form<Ctx extends Context>(): Middleware<
  Ctx,
  Response,
  Ctx & { body: FormData }
>
export function form<Ctx extends Context, const T extends ZFromStringsMap>(
  schema: T,
): Middleware<Ctx, Response, Ctx & { body: z.infer<T> }>
export function form<Ctx extends Context, const K extends string>(
  key: K,
): Middleware<Ctx, Response, Ctx & { [body in K]: FormData }>
export function form<
  Ctx extends Context,
  const K extends string,
  const T extends ZFromStringsMap,
>(key: K, schema: T): Middleware<Ctx, Response, Ctx & { [body in K]: z.infer<T> }>

export function form(
  ...args: unknown[]
): Middleware<Context, Response, Record<string, unknown>> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "body"
  const schema = args[0] as ZFromStringsMap | undefined

  return async (ctx, next) => {
    const contentType = ctx.request.headers.get("content-type")
    if (!contentType || ct.parse(contentType).type !== CONTENT_TYPE) {
      return Promise.reject(new BodyTypeError({ expected: CONTENT_TYPE }))
    }

    let body: FormData
    try {
      body = await ctx.request.formData()
    } catch (err) {
      const cause = err instanceof Error ? err : undefined
      return Promise.reject(new BodyTypeError({ expected: CONTENT_TYPE, cause }))
    }

    if (schema) {
      const map: Record<string, string[]> = {}
      for (const [k, v] of body) {
        if (typeof v === "string") (map[k] ??= []).push(v)
      }

      const parsed = await fromStringsMap(schema).safeParseAsync(map)
      if (!parsed.success) {
        return Promise.reject(new BodyValidationError({ cause: parsed.error }))
      }

      return next({ ...ctx, [key]: parsed.data })
    } else {
      return next({ ...ctx, [key]: body })
    }
  }
}
