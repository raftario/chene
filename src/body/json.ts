import { type z, type ZodType } from "zod"

import { type Middleware } from "../middleware.js"
import { type Context, type Json } from "../mod.js"
import { BodyTypeError, BodyValidationError } from "./error.js"

export function json<I extends Context, O>(): Middleware<I, O, I & { body: Json }, O>
export function json<const T extends ZodType, I extends Context, O>(
  schema: T,
): Middleware<I, O, I & { body: z.infer<T> }, O>
export function json<const K extends string, I extends Context, O>(
  key: K,
): Middleware<I, O, I & { [body in K]: Json }, O>
export function json<
  const K extends string,
  const T extends ZodType,
  I extends Context,
  O,
>(key: K, schema: T): Middleware<I, O, I & { [body in K]: z.infer<T> }, O>

export function json<O>(
  ...args: unknown[]
): Middleware<Context, O, Record<string, unknown>, O> {
  const key = typeof args[0] === "string" ? (args.shift() as string) : "body"
  const schema = args[0] as ZodType | undefined

  return async (input, next) => {
    let body: unknown
    try {
      body = await input.request.json()
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

    return next({ ...input, [key]: body })
  }
}
