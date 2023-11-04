import { type Middleware } from "../middleware.js"
import { type Context, type z } from "../mod.js"
import { fromStringsMap, type ZFromStringsMap } from "../validation/string.js"
import { QueryValidationError } from "./error.js"

export function query<I extends Context, O>(): Middleware<
  I,
  O,
  I & { query: URLSearchParams },
  O
>
export function query<const T extends ZFromStringsMap, I extends Context, O>(
  schema: T,
): Middleware<I, O, I & { query: z.infer<T> }, O>
export function query<const K extends string, I extends Context, O>(
  key: K,
): Middleware<I, O, I & { [body in K]: URLSearchParams }, O>
export function query<
  const K extends string,
  const T extends ZFromStringsMap,
  I extends Context,
  O,
>(key: K, schema: T): Middleware<I, O, I & { [body in K]: z.infer<T> }, O>

export function query<O>(
  ...args: unknown[]
): Middleware<Context, O, Record<string, unknown>, O> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "query"
  const schema = args[0] as ZFromStringsMap | undefined

  if (schema) {
    return async (input, next) => {
      const map: Record<string, string[]> = {}
      for (const [k, v] of input.url.searchParams) (map[k] ??= []).push(v)

      const parsed = await fromStringsMap(schema).safeParseAsync(map)
      if (!parsed.success) {
        return Promise.reject(new QueryValidationError({ cause: parsed.error }))
      }

      return next({ ...input, [key]: parsed.data })
    }
  } else {
    return (input, next) => next({ ...input, [key]: input.url.searchParams })
  }
}
