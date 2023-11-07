import { renderToString } from "preact-render-to-string"
import statuses from "statuses"

import { type Json, type Node } from "./mod.js"

/**
 * Creates a text response
 *
 * @param data - Text to send in the response body
 */
export function text(data: string, options?: ResponseInit): Response {
  return new Response(data, options)
}

/**
 * Creates a JSON response
 *
 * @param data - JSON data to send in the response body
 */
export function json(data: Json, options?: ResponseInit): Response {
  return Response.json(data, options)
}

/**
 * Creates a redirect
 *
 * @see [Redirections in HTTP on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
 *
 * @param url - URL to redirect to
 * @param status - Redirection status code
 */
export function redirect(
  url: string | URL,
  status: 301 | 302 | 303 | 307 | 308 = 301,
): Response {
  return Response.redirect(url, status)
}

/**
 * Creates a response with the given status code and its default status message as the body
 *
 * @param status - Status code
 */
export function status(
  status: number,
  options?: Omit<ResponseInit, "status">,
): Response {
  return new Response(statuses(status), { ...options, status: status })
}

/**
 * Creates an HTML response
 *
 * @param data - HTML data to send in the response body
 */
export function html(data: string, options?: ResponseInit): Response
/**
 * Creates an HTML response from a JSX node
 *
 * @param node - JSX node to render and send in the response body
 */
export function html(node: Node, options?: ResponseInit): Response

export function html(data: string | Node, options?: ResponseInit): Response {
  if (typeof data !== "string") {
    data = renderToString(data)
  }
  return new Response(data, {
    ...options,
    headers: { "Content-Type": "text/html; charset=utf-8", ...options?.headers },
  })
}
