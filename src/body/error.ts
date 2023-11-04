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

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
export class BodyValidationError extends Error {
  constructor(options: { cause: ZodError }) {
    super("Invalid body", options)
  }
}
export interface BodyValidationError {
  cause: ZodError
}
/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging */
