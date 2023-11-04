import * as http from "node:http"
import * as http2 from "node:http2"
import { type AddressInfo } from "node:net"
import { type Writable } from "node:stream"
import { TLSSocket } from "node:tls"

import type * as undici from "undici-types"

import {
  type Context,
  type Handler,
  type ServeOptions,
  type TlsServeOptions,
} from "../index.js"
import { status as statusResponse } from "../response.js"
import { makeHandler, type V8Server as Server, withDefaults } from "./shared.js"

export function serve(
  handler: Handler,
  options: ServeOptions | TlsServeOptions,
): Server {
  const o = withDefaults(options)
  const h = makeHandler(handler)

  const local = { address: o.hostname, port: o.port }

  let resolveFinished!: () => void
  const finished = new Promise<void>((resolve) => {
    resolveFinished = resolve
  })

  const nodeHandler = async (
    req: http.IncomingMessage | http2.Http2ServerRequest,
    res: http.ServerResponse | http2.Http2ServerResponse,
  ) => {
    let response: Response
    try {
      const request = convertRequest(req)
      const input: Context = {
        request: request as unknown as Request,
        url: new URL(request.url),
        network: {
          local,
          peer: {
            address: req.socket.remoteAddress!,
            port: req.socket.remotePort!,
          },
        },
      }

      response = await h(input)
    } catch (err) {
      o.onError(err)
      response = statusResponse(500)
    }
    try {
      await sendResponse(response as unknown as undici.Response, res)
    } catch (err) {
      o.onError(err)
    }
  }

  const server =
    "cert" in o && "key" in o
      ? http2.createSecureServer(
          { cert: o.cert, key: o.key },
          (req, res) => void nodeHandler(req, res).catch(o.onError),
        )
      : http.createServer((req, res) => void nodeHandler(req, res).catch(o.onError))

  o.signal?.addEventListener?.("abort", () => server.close())

  server.on("error", o.onError)
  server.on("listening", () => {
    const address = server.address() as AddressInfo

    local.address = address.address
    local.port = address.port

    o.onListen?.(local)
  })
  server.once("close", resolveFinished)

  server.listen(o.port, o.hostname)
  return {
    shutdown: () => {
      server.close()
      return finished
    },
    ref: () => server.ref(),
    unref: () => server.unref(),
    finished,
  }
}

function convertRequest(
  req: http.IncomingMessage | http2.Http2ServerRequest,
): undici.Request {
  const protocol =
    req.socket instanceof TLSSocket || req.headers["x-forwarded-proto"] === "https"
      ? "https"
      : "http"
  const hostname = req.headers.host ?? req.headers[":authority"]
  const url = `${protocol}://${hostname as string}${req.url}`

  const method = req.method ?? "GET"

  const headers = Object.fromEntries(
    Object.entries(req.headers).filter(([, v]) => v !== undefined),
  ) as undici.RequestInit["headers"]
  const body: Pick<undici.RequestInit, "body" | "duplex"> | undefined =
    method === "GET" || method === "HEAD" ? undefined : { body: req, duplex: "half" }

  return new (Request as unknown as typeof undici.Request)(url, {
    method,
    headers,
    ...body,
  })
}

async function sendResponse(
  response: undici.Response,
  res: http.ServerResponse | http2.Http2ServerResponse,
) {
  res.writeHead(response.status, Object.fromEntries(response.headers))

  if (response.body) {
    for await (const chunk of response.body) {
      await new Promise<void>((resolve, reject) =>
        (res as Writable).write(chunk, (err) => {
          if (err) reject(err)
          else resolve()
        }),
      )
    }
  }

  res.end()
}
