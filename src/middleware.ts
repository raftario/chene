export type Middleware<I, O, Ctx> = (
  input: I,
  next: (ctx: Ctx) => Promise<O>,
) => Promise<O>

export interface AsMiddleware<I, O, Ctx> {
  middleware(): Middleware<I, O, Ctx>
}

export function asMiddleware<I, O, Ctx>(
  middleware: Middleware<I, O, Ctx> | AsMiddleware<I, O, Ctx>,
): Middleware<I, O, Ctx> {
  if ("middleware" in middleware) {
    return middleware.middleware()
  } else {
    return middleware
  }
}

export function throwInMiddleware<I, O>(
  middleware: Middleware<I, O, unknown>,
  input: I,
  err: unknown,
): Promise<O> {
  return middleware(input, () => Promise.reject(err))
}
