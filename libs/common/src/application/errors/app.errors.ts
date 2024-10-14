import { HttpStatus } from "@nestjs/common";
import { Result } from "../base";
import { BaseError } from "./base.errors";

/**
 * @desc General application errors (few of these as possible)
 * @http 500
 */
export namespace AppError {
  const _context = "AppError";

  export class UnexpectedError extends BaseError {
    private readonly _brand?: void;

    public constructor(error?: Error, secondMessage?: string) {
      super({
        name: "UnexpectedError",
        message: error
          ? `An unexpected error occurred: ${error.message}. ${secondMessage}`
          : "An unexpected error occurred. " + secondMessage,
        context: _context,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  export type UnexpectedErrorResult<T> = Result<T, UnexpectedError>;

  export class TransactionalError extends BaseError {
    private readonly _brand?: TransactionalError;

    public constructor() {
      super({
        name: "TransactionalError",
        message: `A transactional error has ocurred`,
        context: _context
      });
    }
  }

  export type TransactionalErrorResult<T> = Result<T, ValidationError>;

  export class ValidationError extends BaseError {
    private readonly _brand?: ValidationError;

    public constructor(message: string) {
      super({ name: "ValidationError", message, context: _context, statusCode: HttpStatus.BAD_REQUEST });
    }
  }

  export type ValidationErrorResult<T> = Result<T, ValidationError>;


  export class NotFoundError extends BaseError {
    public constructor(message: string) {
      super({ name: "NotFoundError", message, context: _context, statusCode: HttpStatus.NOT_FOUND });
    }
  }

  export type NotFoundResult<T> = Result<T, NotFoundError>;

  export class AlreadyExistError extends BaseError {
    public constructor(message: string) {
      super({ name: "AlreadyExistError", message, context: _context, statusCode: HttpStatus.CONFLICT });
    }
  }

  export type AlreadyExistErrorResult<T> = Result<T, AlreadyExistError>;

  export class UnauthorizedError extends BaseError {
    public constructor(message: string = "Not Authorized") {
      super({ name: "UnexpectedError", message, context: _context, statusCode: HttpStatus.UNAUTHORIZED });
    }
  }

  export type UnauthorizedErrorResult<T> = Result<T, UnauthorizedError>;

  export class MicroserviceCommunicationError extends BaseError {
    private readonly _brand?: MicroserviceCommunicationError;

    public constructor(message: string) {
      super({ name: "MicroserviceCommunicationError", message, context: _context, statusCode: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  export type MicroserviceCommunicationErrorResult<T> = Result<T, MicroserviceCommunicationError>;
}
