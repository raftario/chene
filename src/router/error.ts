import { BodyTypeError, BodyValidationError } from "../body/error.js"
import * as response from "../response.js"
import { QueryValidationError } from "../url/error.js"
import { type ZError } from "../validation.js"

export class RouterError extends Error {
  readonly method: string
  readonly path: string

  constructor(
    info: { method: string; path: string },
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options)

    this.method = info.method
    this.path = info.path

    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class NotFoundError extends RouterError {
  constructor(info: { method: string; path: string }) {
    super(info, "Not found")
  }
}
export class MethodNotAllowedError extends RouterError {
  readonly route: string
  readonly allowed: string[]

  constructor(info: {
    method: string
    path: string
    route: string
    allowed: string[]
  }) {
    super(info, "Method not allowed")
    this.route = info.route
    this.allowed = info.allowed
  }
}

type FormattedError = { [key: string]: FormattedError } & { _errors: string[] }
function formatValidationError(err: ZError) {
  const format = (err: FormattedError, depth: number) => {
    const indent = " ".repeat(depth * 2)
    const errors = err._errors.map((s) => `${indent}- ${s}`)

    const recursive = Object.entries(err).filter(([key]) => key !== "_errors")

    // flatten single element tuples
    if (recursive.length === 1 && recursive[0]![0] === "0") {
      errors.push(...format(recursive[0]![1] as FormattedError, depth))
    } else {
      for (const [key, value] of recursive) {
        errors.push(`${indent}${key}:`)
        errors.push(...format(value as FormattedError, depth + 1))
      }
    }

    return errors
  }
  return format(err.format() as FormattedError, 0)
}

export function defaultErrorHandler(err: unknown): Response {
  if (err instanceof NotFoundError) {
    return response.status(404)
  } else if (err instanceof MethodNotAllowedError) {
    return response.status(405, { headers: { allow: err.allowed.join(", ") } })
  } else if (err instanceof BodyTypeError) {
    return response.status(415)
  } else if (
    err instanceof BodyValidationError ||
    err instanceof QueryValidationError
  ) {
    const errors = formatValidationError(err.cause)
    const body = [err.message, "", ...errors].join("\n")
    return response.text(body, { status: 400 })
  } else {
    throw err
  }
}
