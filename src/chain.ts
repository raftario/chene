import { type AsMiddleware, asMiddleware, type Middleware } from "./middleware.js"
import { type Awaitable } from "./mod.js"

/**
 * Middleware error handler
 *
 * @remarks
 *
 * It receives both the error and the input available at the level it was chained.
 *
 * @typeParam I - Input type of the error handler
 * @typeParam O - Output type of the error handler
 */
export type ErrorHandler<I, O> = (error: unknown, input: I) => Awaitable<O>

/**
 * A chain wraps a middleware to facilitate composition by chaining it with other middleware
 *
 * @see {@link Middleware}
 */
export class Chain<I, O, II, OO> implements AsMiddleware<I, O, II, OO> {
  #middleware: Middleware<I, O, II, OO>

  /** Wraps a middleware into a new chain */
  constructor(middleware: Middleware<I, O, II, OO>) {
    this.#middleware = asMiddleware(middleware)
  }

  middleware(): Middleware<I, O, II, OO> {
    return this.#middleware
  }

  /**
   * Chains a middleware to the current one
   *
   * @remarks
   *
   * The chained middleware will receive the input passed to the `next` function by the current middleware.
   * It needs to produce the output that the current middleware expects from the `next` function.
   *
   * @typeParam III - New input passed to the `next` function by the chained middleware
   * @typeParam OOO - New output expected from the `next` function by the chained middleware
   *
   * @param middleware - Middleware to chain
   * @returns New chain with the chained middleware
   */
  use<III, OOO>(
    middleware: Middleware<II, OO, III, OOO> | AsMiddleware<II, OO, III, OOO>,
  ): Chain<I, O, III, OOO> {
    const current = this.#middleware
    const m = asMiddleware(middleware)
    return new Chain((input, next) =>
      current(input, (middlewareInput) => m(middlewareInput, next)),
    )
  }

  /**
   * Chains an error handler to the current middleware
   *
   * @remarks
   *
   * The error handler is chained by catching errors thrown by the call to the `next` function.
   * It receives both the error and the input that was given to the `next` call. It needs to either
   * produce the output that the `next` function would have, or re-throw the error it received if it can't.
   *
   * Note that if the call to `next` mutated the input in-place before throwing,
   * the error handler will receive the mutated input.
   *
   * @param errorHandler - Error handler to chain
   * @returns New chain with the chained error handler
   */
  catch(errorHandler: ErrorHandler<II, OO>): Chain<I, O, II, OO> {
    const current = this.#middleware
    return new Chain((input, next) =>
      current(input, async (errorHandlerInput) => {
        try {
          return await next(errorHandlerInput)
        } catch (error) {
          return await errorHandler(error, errorHandlerInput)
        }
      }),
    )
  }
}
