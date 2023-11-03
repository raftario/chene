import { type ZError } from "../validation.js"

export class UrlError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
export class QueryValidationError extends Error {
  constructor(options: { cause: ZError }) {
    super("Invalid query string", options)
  }
}
export interface QueryValidationError {
  cause: ZError
}
/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging */
