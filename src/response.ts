import { type VNode } from "preact"
import { renderToString } from "preact-render-to-string"
import statuses from "statuses"

export function text(data: string, options?: ResponseInit): Response {
  return new Response(data, options)
}

export function json(data: unknown, options?: ResponseInit): Response {
  return Response.json(data, options)
}

export function redirect(url: string | URL, status: 301 | 308 = 301): Response {
  return Response.redirect(url, status)
}

export function status(code: number, options?: Omit<ResponseInit, "status">): Response {
  return new Response(statuses(code), { ...options, status: code })
}

export function html(data: string, options?: ResponseInit): Response
export function html(node: VNode, options?: ResponseInit): Response
export function html(data: string | VNode, options?: ResponseInit): Response {
  if (typeof data !== "string") {
    data = renderToString(data)
  }
  return new Response(data, {
    ...options,
    headers: { "Content-Type": "text/html; charset=utf-8", ...options?.headers },
  })
}
