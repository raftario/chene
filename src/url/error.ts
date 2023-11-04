import { type ZodError } from "zod"

export class UrlError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class QueryValidationError extends Error {
  override readonly cause: ZodError

  constructor(options: { cause: ZodError }) {
    super("Invalid query string", options)
    this.cause = options.cause
  }
}
