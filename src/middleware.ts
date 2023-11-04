/**
 * A middleware is a function that encapsulates another function and transforms it
 *
 * @remarks
 *
 * They can both transform the input and output of the function,
 * and add additional functionality around it.
 *
 * @typeParam I - Input type of the middleware
 * @typeParam O - (Tranformed) Output type of the middleware
 * @typeParam II - (Tranformed) Input type of the encapsulated function
 * @typeParam OO - Output type of the encapsulated function
 */
export type Middleware<I, O, II, OO> = (
  input: I,
  next: (input: II) => Promise<OO>,
) => Promise<O>

/** Type convertible to a {@link Middleware} */
export interface AsMiddleware<I, O, II, OO> {
  middleware(): Middleware<I, O, II, OO>
}

/** Flattens {@link AsMiddleware} to {@link Middleware} */
export function asMiddleware<I, O, II, OO>(
  middleware: Middleware<I, O, II, OO> | AsMiddleware<I, O, II, OO>,
): Middleware<I, O, II, OO> {
  if ("middleware" in middleware) {
    return middleware.middleware()
  } else {
    return middleware
  }
}

/** Throws an error inside a middleware so it can potentially catch it */
export function throwInMiddleware<I, O, II, OO>(
  middleware: Middleware<I, O, II, OO>,
  input: I,
  error: unknown,
): Promise<O> {
  return middleware(input, () => Promise.reject(error))
}
