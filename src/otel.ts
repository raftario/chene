import {
  type Attributes,
  type Histogram,
  metrics,
  SpanKind,
  SpanStatusCode,
  trace,
  type Tracer,
  type UpDownCounter,
  ValueType,
} from "@opentelemetry/api"

import { name, version } from "../package.json"
import { type Middleware } from "./middleware.js"
import { type RouterContext } from "./router.js"

const enum Attribute {
  CLIENT_ADDRESS = "client.address",
  CLIENT_PORT = "client.port",
  ERROR_TYPE = "error.type",
  HTTP_REQUEST_BODY_SIZE = "http.request.body.size",
  HTTP_REQUEST_METHOD = "http.request.method",
  HTTP_RESPONSE_BODY_SIZE = "http.response.body.size",
  HTTP_RESPONSE_STATUS_CODE = "http.response.status_code",
  HTTP_ROUTE = "http.route",
  SERVER_ADDRESS = "server.address",
  SERVER_PORT = "server.port",
  URL_PATH = "url.path",
  URL_QUERY = "url.query",
  URL_SCHEME = "url.scheme",
  USER_AGENT_ORIGINAL = "user_agent.original",
}

let _tracer: Tracer | undefined = undefined
const tracer = () => (_tracer ??= trace.getTracer(name, version))

let _meters: { requestDuration: Histogram; activeRequests: UpDownCounter } | undefined =
  undefined
const meters = () => {
  const meter = metrics.getMeter(name, version)
  return (_meters ??= {
    requestDuration: meter.createHistogram("http.server.request.duration", {
      unit: "s",
      valueType: ValueType.DOUBLE,
    }),
    activeRequests: meter.createUpDownCounter("http.server.active_requests", {
      valueType: ValueType.INT,
    }),
  })
}

export const otel: Middleware<RouterContext, Response, RouterContext> = (ctx, next) => {
  const start = performance.now()

  let name = ctx.request.method

  const attributes: Attributes = {}
  const spanAttributes: Attributes = {}

  attributes[Attribute.HTTP_REQUEST_METHOD] = ctx.request.method
  attributes[Attribute.SERVER_ADDRESS] = ctx.network.local.address
  attributes[Attribute.SERVER_PORT] = ctx.network.local.port
  attributes[Attribute.URL_SCHEME] = ctx.url.protocol.slice(0, -1)

  if (ctx.route) {
    name += ` ${ctx.route}`
    attributes[Attribute.HTTP_ROUTE] = ctx.route
  }

  spanAttributes[Attribute.CLIENT_ADDRESS] = ctx.network.peer.address
  spanAttributes[Attribute.CLIENT_PORT] = ctx.network.peer.port
  spanAttributes[Attribute.SERVER_ADDRESS] = ctx.network.local.address
  spanAttributes[Attribute.SERVER_PORT] = ctx.network.local.port
  spanAttributes[Attribute.URL_PATH] = ctx.url.pathname

  if (ctx.url.search) {
    spanAttributes[Attribute.URL_QUERY] = ctx.url.search
  }

  const contentLength = ctx.request.headers.get("content-length") ?? undefined
  const bodySize = contentLength && Number(contentLength)
  if (Number.isSafeInteger(bodySize)) {
    spanAttributes[Attribute.HTTP_REQUEST_BODY_SIZE] = bodySize
  }

  const userAgent = ctx.request.headers.get("user-agent")
  if (userAgent) {
    spanAttributes[Attribute.USER_AGENT_ORIGINAL] = userAgent
  }

  const { requestDuration, activeRequests } = meters()
  return tracer().startActiveSpan(
    name,
    {
      kind: SpanKind.SERVER,
      attributes: { ...attributes, ...spanAttributes },
      startTime: start,
    },
    async (span) => {
      const durationAttributes = { ...attributes }
      activeRequests.add(1, attributes)

      try {
        const response = await next(ctx)

        span.setAttribute(Attribute.HTTP_RESPONSE_STATUS_CODE, response.status)
        attributes[Attribute.HTTP_RESPONSE_STATUS_CODE] = response.status

        const contentLength = response.headers.get("content-length") ?? undefined
        const bodySize = contentLength && Number(contentLength)
        if (Number.isSafeInteger(bodySize)) {
          span.setAttribute(Attribute.HTTP_RESPONSE_BODY_SIZE, bodySize as number)
        }

        if (response.status >= 500) {
          span.setStatus({ code: SpanStatusCode.ERROR })
          attributes[Attribute.ERROR_TYPE] = 500
        }

        return response
      } catch (err) {
        const [name, message] =
          err instanceof Error ? [err.name, err.message] : ["Error", undefined]

        span.setStatus({ code: SpanStatusCode.ERROR, message })
        attributes[Attribute.ERROR_TYPE] = name

        throw err
      } finally {
        const end = performance.now()

        activeRequests.add(-1, attributes)
        requestDuration.record((end - start) / 1000, durationAttributes)
        span.end(end)
      }
    },
  )
}
