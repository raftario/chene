import { Chain, type ErrorHandler } from "./chain.js"
import { type Context } from "./index.js"
import {
  type AsMiddleware,
  asMiddleware,
  type Middleware,
  throwInMiddleware,
} from "./middleware.js"
import {
  defaultErrorHandler,
  MethodNotAllowedError,
  NotFoundError,
} from "./router/error.js"
import { type Match, Trie } from "./router/trie.js"
import { type Awaitable } from "./util.js"

export * from "./router/error.js"

/** Base router context */
export interface RouterContext extends Context {
  route?: string
}

/** Route handler input */
type Input<Route extends string, Ctx extends RouterContext> = Ctx & {
  path: Match<Route>
}

/** Transform to apply to the route handler context */
type Transform<Route extends string, Ctx extends RouterContext, Nxt> = (
  chain: Chain<Ctx, Response, Input<Route, Ctx>>,
) => Chain<Ctx, Response, Nxt>
/** Route handler */
type Handler<Ctx> = (ctx: Ctx) => Awaitable<Response>

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

interface StoredMethodHandlers {
  routerChain: Chain<RouterContext, Response, RouterContext>
  chainTransform: (
    chain: Chain<RouterContext, Response, Input<string, RouterContext>>,
  ) => Chain<RouterContext, Response, Response>
}
type StoredMethods = Record<Method, StoredMethodHandlers | undefined>

export class Router<Ctx extends RouterContext = RouterContext>
  implements AsMiddleware<Context, Response, Response>
{
  readonly #routes: Map<string, StoredMethods>
  readonly #chain: Chain<RouterContext, Response, Ctx>

  constructor(
    routes: Map<string, StoredMethods>,
    chain: Chain<RouterContext, Response, Ctx>,
  ) {
    this.#routes = routes
    this.#chain = chain
  }

  #method(
    method: Method,
    route: string,
    transformOrHandler: unknown,
    maybeHandler?: unknown,
  ): this {
    if (route.at(-1) === "/") route = route.slice(0, -1)

    const [transform, handler]: [
      Transform<string, RouterContext, unknown>,
      Handler<unknown>,
    ] = maybeHandler
      ? [
          transformOrHandler as Transform<string, RouterContext, unknown>,
          maybeHandler as Handler<unknown>,
        ]
      : [(chain) => chain, transformOrHandler as Handler<unknown>]

    const methods = this.#routes.get(route) ?? {
      GET: undefined,
      POST: undefined,
      PUT: undefined,
      PATCH: undefined,
      DELETE: undefined,
    }
    methods[method] = {
      routerChain: this.#chain,
      chainTransform: (chain) =>
        transform(chain).use(async (ctx, next) => next(await handler(ctx))),
    }

    this.#routes.set(route, methods)

    return this
  }

  middleware(): Middleware<Context, Response, Response> {
    const trie = new Trie<Middleware<Context, Response, Response>>()
    for (const [route, handlers] of this.#routes) {
      trie.insert(route, (path) => (ctx, next) => {
        const method = ctx.request.method as Method
        const stored = handlers[method]

        if (!stored) {
          return throwInMiddleware(
            this.#chain.middleware(),
            { ...ctx, route },
            new MethodNotAllowedError({
              method: ctx.request.method,
              path: ctx.url.pathname,
              route,
              allowed: Object.entries(handlers)
                .filter(([, handler]) => handler)
                .map(([method]) => method),
            }),
          )
        }

        const { routerChain, chainTransform } = stored
        return chainTransform(
          routerChain.use((ctx, next) => next({ ...ctx, path })),
        ).middleware()({ ...ctx, route }, next)
      })
    }

    return (ctx, next) => {
      const middleware = trie.match(ctx.url.pathname)

      if (!middleware) {
        return throwInMiddleware(
          this.#chain.middleware(),
          ctx,
          new NotFoundError({ method: ctx.request.method, path: ctx.url.pathname }),
        )
      }

      return middleware(ctx, next)
    }
  }

  use<const Nxt extends RouterContext>(
    middleware: Middleware<Ctx, Response, Nxt> | AsMiddleware<Ctx, Response, Nxt>,
  ): Router<Nxt> {
    return new Router(this.#routes, this.#chain.use(middleware))
  }

  catch(errorHandler: ErrorHandler<Ctx, Response>): Router<Ctx> {
    return new Router(this.#routes, this.#chain.catch(errorHandler))
  }

  get<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, Ctx>>,
  ): this
  get<const Route extends `/${string}`, Nxt>(
    route: Route,
    transform: Transform<Route, Ctx, Nxt>,
    handler: Handler<Nxt>,
  ): this

  get(route: string, transformOrHandler: unknown, maybeHandler?: unknown): this {
    return this.#method("GET", route, transformOrHandler, maybeHandler)
  }

  post<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, Ctx>>,
  ): this
  post<const Route extends `/${string}`, Nxt>(
    route: Route,
    transform: Transform<Route, Ctx, Nxt>,
    handler: Handler<Nxt>,
  ): this

  post(route: string, transformOrHandler: unknown, maybeHandler?: unknown): this {
    return this.#method("POST", route, transformOrHandler, maybeHandler)
  }

  patch<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, Ctx>>,
  ): this
  patch<const Route extends `/${string}`, Nxt>(
    route: Route,
    transform: Transform<Route, Ctx, Nxt>,
    handler: Handler<Nxt>,
  ): this

  patch(route: string, transformOrHandler: unknown, maybeHandler?: unknown): this {
    return this.#method("PATCH", route, transformOrHandler, maybeHandler)
  }

  put<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, Ctx>>,
  ): this
  put<const Route extends `/${string}`, Nxt>(
    route: Route,
    transform: Transform<Route, Ctx, Nxt>,
    handler: Handler<Nxt>,
  ): this

  put(route: string, transformOrHandler: unknown, maybeHandler?: unknown): this {
    return this.#method("PUT", route, transformOrHandler, maybeHandler)
  }

  delete<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, Ctx>>,
  ): this
  delete<const Route extends `/${string}`, Nxt>(
    route: Route,
    transform: Transform<Route, Ctx, Nxt>,
    handler: Handler<Nxt>,
  ): this

  delete(route: string, transformOrHandler: unknown, maybeHandler?: unknown): this {
    return this.#method("DELETE", route, transformOrHandler, maybeHandler)
  }
}

export function router(
  middleware?:
    | Middleware<RouterContext, Response, RouterContext>
    | AsMiddleware<RouterContext, Response, RouterContext>,
): Router {
  const m: Middleware<RouterContext, Response, RouterContext> = middleware
    ? asMiddleware(middleware)
    : (ctx, next) => next(ctx)
  return new Router(new Map(), new Chain(m).catch(defaultErrorHandler))
}
