import { type ZodError } from "zod"

export class BodyError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class BodyTypeError extends Error {
  readonly expected: string

  constructor(options: { expected: string; cause?: Error }) {
    super("Invalid body type", options)
    this.expected = options.expected
  }
}

export class BodyValidationError extends Error {
  override readonly cause: ZodError

  constructor(options: { cause: ZodError }) {
    super("Invalid body", options)
    this.cause = options.cause
  }
}
