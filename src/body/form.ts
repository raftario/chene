import * as ct from "content-type"
import { type z } from "zod"

import { type Middleware } from "../middleware.js"
import { type Context } from "../mod.js"
import { fromStringsMap, type ZFromStringsMap } from "../validation/string.js"
import { BodyTypeError, BodyValidationError } from "./error.js"

const CONTENT_TYPE = "application/x-www-form-urlencoded"

/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the parsed form data.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 */
export function form<I extends Context, O>(): Middleware<
  I,
  O,
  I & { body: FormData },
  O
>
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the form data parsed and validated with the given schema.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param schema - Schema to validate the form data with
 */
export function form<const T extends ZFromStringsMap, I extends Context, O>(
  schema: T,
): Middleware<I, O, I & { body: z.infer<T> }, O>
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the parsed form data.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param key - Key to use for the form data property
 */
export function form<const K extends string, I extends Context, O>(
  key: K,
): Middleware<I, O, I & { [body in K]: FormData }, O>
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the form data parsed and validated with the given schema.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param key - Key to use for the form data property
 * @param schema - Schema to validate the form data with
 */
export function form<
  const K extends string,
  const T extends ZFromStringsMap,
  I extends Context,
  O,
>(key: K, schema: T): Middleware<I, O, I & { [body in K]: z.infer<T> }, O>

export function form<O>(
  ...args: unknown[]
): Middleware<Context, O, Record<string, unknown>, O> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "body"
  const schema = args[0] as ZFromStringsMap | undefined

  return async (input, next) => {
    const contentType = input.request.headers.get("content-type")
    if (!contentType || ct.parse(contentType).type !== CONTENT_TYPE) {
      return Promise.reject(new BodyTypeError({ expected: CONTENT_TYPE }))
    }

    let body: FormData
    try {
      body = await input.request.formData()
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

      return next({ ...input, [key]: parsed.data })
    } else {
      return next({ ...input, [key]: body })
    }
  }
}
