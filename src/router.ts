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
 * @typeParam II - Transformed route input passed to the handler
 * @typeParam OO - Transformed route output returned by the handler
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
 * @remarks
 *
 * Routes can contain named parameters which instead of matching part of the path verbatim will
 * capture one or many path segments and make them available by name to the route handler.
 * The provided path parameters is a properly typed object with the same keys as the named parameters.
 *
 * `:name` will capture a single path segment up to the next `/` or end of the path
 * while `*name` will capture any number of path segments until the end of the path.
 *
 * The router provides facilities to chain middleware both to the entire router through the {@link use} method
 * and to individual routes through a {@link Transform} parameter.
 *
 * This router is based on a prefix tree which means the order in which routes are registered
 * does not influence the matching process and the number of routes does not impact performance.
 *
 * Priority is given to verbatim segments over single named parameters (`:name`)
 * over multiple named parameters (`*name`). This means that `/hello/there` would be matched
 * before `/hello/:name` which would be matched before `/hello/*name`.
 *
 * @example Simple route handler
 * ```ts
 * const app = router()
 * app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name}!`))
 * ```
 *
 * @example Chaining middleware to a route handler
 * ```ts
 * const app = router()
 * app.post(
 *   "/search/:term",
 *   (ctx) => ctx.use(middleware),
 *
 *   (ctx) => {
 *     // ctx.path.term is the string captured by the :term parameter
 *     // ctx will also contain any value the middleware might have added
 *     // and will by typed accordingly
 *   }
 * )
 * ```
 *
 * @typeParam I - Input type of route handlers and chained middleware
 * @typeParam O - Output type of route handlers and chained middleware
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

  /**
   * Chains a middleware to the router
   *
   * @group Chaining
   *
   * @remarks
   *
   * Note that this method returns a new router. The new router shares the same routes
   * as the original one, but the middleware will not apply to the previously registered routes,
   * only the ones registered on the new router.
   *
   * Since the routes are shared, this method can be called two times on the same router and
   * routes can be registered on the two resulting routers, and all three routers will share
   * all the registered routes.
   *
   * @example Sharing routes
   * ```ts
   * const app = router()
   * const app1 = app1.use(middleware1)
   * const app2 = app2.use(middleware2)
   *
   * app.get("/foo", () => response.text("foo"))
   * app1.get("/bar", () => response.text("bar"))
   * app2.get("/baz", () => response.text("baz"))
   *
   * // /foo, /bar and /baz are all available
   * serve(app, { port: 8080 })
   * ```
   *
   * @see {@link Chain.use}
   *
   * @typeParam II - Input type of the `next` function of the middleware
   * @typeParam OO - Output type of the `next` function of the middleware
   *
   * @param middleware - Middeware to chain
   * @returns A new router with the given middleware chained and the existing routes
   */
  use<II extends RouterContext, OO>(
    middleware: Middleware<I, O, II, OO>,
  ): Router<II, OO> {
    return new Router(this.#routes, this.#chain.use(middleware))
  }

  /**
   * Chains an error handler to the router
   *
   * @group Chaining
   *
   * @remarks
   *
   * Note that this method behaves the same as {@link use} and returns a new router with shared routes.
   * It will only catch errors thrown by the routes registered on the new router and
   * by middleware chained after it.
   *
   * The error handler returns the same type as route handlers and chained middleware, since its goal is
   * to gracefully handle errors and return an appropriate response. It is good practice to re-throw errors
   * that the error handler doesn't know how to produce a response for so that upstream error handlers can
   * do it instead.
   *
   * @example Catching errors
   * ```ts
   * let app = router()
   *
   * // errors thrown from this middleware won't be caught
   * app = app.use(middelware1)
   * // errors thrown from this route won't be caught
   * app.get("/foo", () => {
   *   throw new Error("foo")
   * })
   *
   * app = app.catch((error, input) => {
   *   console.error(error)
   *   return response.status(500)
   * })
   *
   * // errors thrown from this middleware will be caught
   * app = app.use(middleware2)
   * // errors thrown from this route will be caught
   * app.get("/bar", () => {
   *  throw new Error("bar")
   * })
   * ```
   *
   * @see {@link Chain.catch}
   *
   * @param errorHandler - Error handler to chain
   * @returns A new router with the given error handler chained and the existing routes
   */
  catch(errorHandler: ErrorHandler<I, O>): Router<I, O> {
    return new Router(this.#routes, this.#chain.catch(errorHandler))
  }

  /**
   * Registers the given `GET` route handler with its own middleware chain
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   * @typeParam II - Transformed route input passed to the handler
   * @typeParam OO - Transformed route output returned by the handler
   *
   * @param route - Route to register
   * @param transform - Middleware chain transform to apply to the route handler
   * @param handler - Route handler
   */
  get<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  /**
   * Registers the given `GET` route handler
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   *
   * @param route - Route to register
   * @param handler - Route handler
   */
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

  /**
   * Registers the given `POST` route handler with its own middleware chain
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   * @typeParam II - Transformed route input passed to the handler
   * @typeParam OO - Transformed route output returned by the handler
   *
   * @param route - Route to register
   * @param transform - Middleware chain transform to apply to the route handler
   * @param handler - Route handler
   */
  post<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  /**
   * Registers the given `POST` route handler
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   *
   * @param route - Route to register
   * @param handler - Route handler
   */
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

  /**
   * Registers the given `PATCH` route handler with its own middleware chain
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   * @typeParam II - Transformed route input passed to the handler
   * @typeParam OO - Transformed route output returned by the handler
   *
   * @param route - Route to register
   * @param transform - Middleware chain transform to apply to the route handler
   * @param handler - Route handler
   */
  patch<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  /**
   * Registers the given `PATCH` route handler
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   *
   * @param route - Route to register
   * @param handler - Route handler
   */
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

  /**
   * Registers the given `PUT` route handler with its own middleware chain
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   * @typeParam II - Transformed route input passed to the handler
   * @typeParam OO - Transformed route output returned by the handler
   *
   * @param route - Route to register
   * @param transform - Middleware chain transform to apply to the route handler
   * @param handler - Route handler
   */
  put<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  /**
   * Registers the given `PUT` route handler
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   *
   * @param route - Route to register
   * @param handler - Route handler
   */
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

  /**
   * Registers the given `DELETE` route handler with its own middleware chain
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   * @typeParam II - Transformed route input passed to the handler
   * @typeParam OO - Transformed route output returned by the handler
   *
   * @param route - Route to register
   * @param transform - Middleware chain transform to apply to the route handler
   * @param handler - Route handler
   */
  delete<const Route extends `/${string}`, II, OO>(
    route: Route,
    transform: Transform<Route, I, O, II, OO>,
    handler: Handler<II, OO>,
  ): this
  /**
   * Registers the given `DELETE` route handler
   *
   * @group Routing
   *
   * @typeParam Route - String literal type representing the route
   *
   * @param route - Route to register
   * @param handler - Route handler
   */
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
