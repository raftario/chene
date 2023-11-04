/** @module chene/router */

import { Chain, type ErrorHandler } from "./chain.js"
import { type Awaitable, type Context } from "./index.js"
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

export * from "./router/error.js"

/** Base router context */
export interface RouterContext extends Context {
  /** Currently matched route */
  route?: string
}

/**
 * Input type combining the route input with the route parameters
 *
 * @typeParam Route - String literal type representing the route
 * @typeParam I - Route input
 */
export type Input<Route extends string, I extends RouterContext> = I & {
  path: Match<Route>
}

/**
 * Transform to apply to a route input and output before passing them to the handler
 *
 * @typeParam Route - String literal type representing the route
 * @typeParam I - Route input
 * @typeParam O - Route output
 * @typeParam II - Transformed route input, will be passed to the handler
 * @typeParam OO - Transformed route output, will be returned by the handler
 */
export type Transform<Route extends string, I extends RouterContext, O, II, OO> = (
  chain: Chain<RouterContext, Response, Input<Route, I>, O>,
) => Chain<RouterContext, Response, II, OO>

/** Route handler */
export type Handler<I, O> = (input: I) => Awaitable<O>

/** HTTP method */
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type StoredMethodHandler = (
  path: Match<string>,
) => Middleware<RouterContext, Response, Response, Response>
type StoredMethods = Record<Method, StoredMethodHandler | undefined>

/**
 * A router is a middleware that routes requests to other middlewares based on their method and path
 *
 * Routes can contain parameters
 *
 * This router is based on a prefix tree which means the order in which routes are registered
 * does not influence the matching process.
 */
export class Router<I extends RouterContext = RouterContext, O = Response>
  implements AsMiddleware<Context, Response, Response, Response>
{
  readonly #routes: Map<string, StoredMethods>
  readonly #chain: Chain<RouterContext, Response, I, O>

  /** @internal */
  constructor(
    routes: Map<string, StoredMethods>,
    chain: Chain<RouterContext, Response, I, O>,
  ) {
    this.#routes = routes
    this.#chain = chain
  }

  #method<II, OO>(
    method: Method,
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    if (route.at(-1) === "/") route = route.slice(0, -1)

    const methods = this.#routes.get(route) ?? {
      GET: undefined,
      POST: undefined,
      PUT: undefined,
      PATCH: undefined,
      DELETE: undefined,
    }

    const chain = this.#chain
    if (args.length === 2) {
      const [transform, handler] = args

      methods[method] = (path) => async (routerInput, next) =>
        next(
          await transform(
            chain.use((routeInput, next) => next({ ...routeInput, path })),
          ).middleware()(
            routerInput,
            async (transformedInput) => await handler(transformedInput),
          ),
        )
    } else {
      const [handler] = args

      methods[method] = (path) => async (routerInput, next) =>
        next(
          await chain.middleware()(
            routerInput,
            async (routeInput) => await handler({ ...routeInput, path }),
          ),
        )
    }

    this.#routes.set(route, methods)

    return this
  }

  middleware(): Middleware<Context, Response, Response, Response> {
    const trie = new Trie<Middleware<Context, Response, Response, Response>>()
    for (const [route, handlers] of this.#routes) {
      trie.insert(route, (path) => (input, next) => {
        const method = input.request.method as Method
        const stored = handlers[method]

        if (!stored) {
          return throwInMiddleware(
            this.#chain.middleware(),
            { ...input, route },
            new MethodNotAllowedError({
              method: input.request.method,
              path: input.url.pathname,
              route,
              allowed: Object.entries(handlers)
                .filter(([, handler]) => handler)
                .map(([method]) => method),
            }),
          )
        }

        return stored(path)(input, next)
      })
    }

    return (input, next) => {
      const middleware = trie.match(input.url.pathname)

      if (!middleware) {
        return throwInMiddleware(
          this.#chain.middleware(),
          input,
          new NotFoundError({ method: input.request.method, path: input.url.pathname }),
        )
      }

      return middleware(input, next)
    }
  }

  use<II extends RouterContext, OO>(
    middleware: Middleware<I, O, II, OO>,
  ): Router<II, OO> {
    return new Router(this.#routes, this.#chain.use(middleware))
  }

  catch(errorHandler: ErrorHandler<I, O>): Router<I, O> {
    return new Router(this.#routes, this.#chain.catch(errorHandler))
  }

  get<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  get<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, I>, O>,
  ): this

  get<II, OO>(
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    return this.#method("GET", route, ...args)
  }

  post<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  post<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, I>, O>,
  ): this

  post<II, OO>(
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    return this.#method("POST", route, ...args)
  }

  patch<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  patch<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, I>, O>,
  ): this

  patch<II, OO>(
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    return this.#method("PATCH", route, ...args)
  }

  put<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  put<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, I>, O>,
  ): this

  put<II, OO>(
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    return this.#method("PUT", route, ...args)
  }

  delete<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  delete<const Route extends `/${string}`>(
    route: Route,
    handler: Handler<Input<Route, I>, O>,
  ): this

  delete<II, OO>(
    route: string,
    ...args:
      | [transform: Transform<string, I, O, II, OO>, handler: Handler<II, OO>]
      | [handler: Handler<Input<string, I>, O>]
  ): this {
    return this.#method("DELETE", route, ...args)
  }
}

/**
 * Creates a new router
 *
 * @param middleware - Root middleware which is chained before anything else, including the router's builtin error handler
 */
export function router(
  middleware:
    | Middleware<RouterContext, Response, RouterContext, Response>
    | AsMiddleware<RouterContext, Response, RouterContext, Response> = (input, next) =>
    next(input),
): Router {
  return new Router(
    new Map(),
    new Chain(asMiddleware(middleware)).catch(defaultErrorHandler),
  )
}
