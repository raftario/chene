import { type Context } from "../index.js"
import { type Middleware } from "../middleware.js"
import { type z, type ZFromStringsMap } from "../validation.js"
import { fromStringsMap } from "../validation/string.js"
import { QueryValidationError } from "./error.js"

export function query<Ctx extends Context>(): Middleware<
  Ctx,
  Response,
  Ctx & { query: URLSearchParams }
>
export function query<Ctx extends Context, const T extends ZFromStringsMap>(
  schema: T,
): Middleware<Ctx, Response, Ctx & { query: z.infer<T> }>
export function query<Ctx extends Context, const K extends string>(
  key: K,
): Middleware<Ctx, Response, Ctx & { [body in K]: URLSearchParams }>
export function query<
  Ctx extends Context,
  const K extends string,
  const T extends ZFromStringsMap,
>(key: K, schema: T): Middleware<Ctx, Response, Ctx & { [body in K]: z.infer<T> }>

export function query(
  ...args: unknown[]
): Middleware<Context, Response, Record<string, unknown>> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "query"
  const schema = args[0] as ZFromStringsMap | undefined

  if (schema) {
    return async (ctx, next) => {
      const map: Record<string, string[]> = {}
      for (const [k, v] of ctx.url.searchParams) (map[k] ??= []).push(v)

      const parsed = await fromStringsMap(schema).safeParseAsync(map)
      if (!parsed.success) {
        return Promise.reject(new QueryValidationError({ cause: parsed.error }))
      }

      return next({ ...ctx, [key]: parsed.data })
    }
  } else {
    return (ctx, next) => next({ ...ctx, [key]: ctx.url.searchParams })
  }
}
