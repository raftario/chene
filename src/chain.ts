import { type AsMiddleware, asMiddleware, type Middleware } from "./middleware.js"
import { type Awaitable } from "./mod.js"

export type ErrorHandler<I, O> = (error: unknown, input: I) => Awaitable<O>

export class Chain<I, O, II, OO> implements AsMiddleware<I, O, II, OO> {
  #middleware: Middleware<I, O, II, OO>

  constructor(middleware: Middleware<I, O, II, OO>) {
    this.#middleware = asMiddleware(middleware)
  }

  middleware(): Middleware<I, O, II, OO> {
    return this.#middleware
  }

  use<III, OOO>(
    middleware: Middleware<II, OO, III, OOO> | AsMiddleware<II, OO, III, OOO>,
  ): Chain<I, O, III, OOO> {
    const current = this.#middleware
    const m = asMiddleware(middleware)
    return new Chain(async (input, next) =>
      current(input, (middlewareInput) => m(middlewareInput, next)),
    )
  }

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
