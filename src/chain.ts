import { type AsMiddleware, asMiddleware, type Middleware } from "./middleware.js"
import { type Awaitable } from "./util.js"

export type ErrorHandler<I, O> = (err: unknown, ctx: I) => Awaitable<O>

export class Chain<I, O, Ctx> implements AsMiddleware<I, O, Ctx> {
  #middleware: Middleware<I, O, Ctx>

  constructor(middleware: Middleware<I, O, Ctx> | AsMiddleware<I, O, Ctx>) {
    this.#middleware = asMiddleware(middleware)
  }

  middleware(): Middleware<I, O, Ctx> {
    return this.#middleware
  }

  use<const Nxt>(
    middleware: Middleware<Ctx, O, Nxt> | AsMiddleware<Ctx, O, Nxt>,
  ): Chain<I, O, Nxt> {
    const current = this.#middleware
    const m = asMiddleware(middleware)
    return new Chain(async (input, next) => current(input, (ctx) => m(ctx, next)))
  }

  catch(errorHandler: ErrorHandler<Ctx, O>): Chain<I, O, Ctx> {
    const current = this.#middleware
    return new Chain((input, next) =>
      current(input, async (ctx) => {
        try {
          return await next(ctx)
        } catch (err) {
          return await errorHandler(err, ctx)
        }
      }),
    )
  }
}
