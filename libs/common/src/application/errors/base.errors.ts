import { IResultError } from "./result.interface";

type BaseErrorProps = {
  name: string;
  message: string;
  context?: string;
  statusCode?: number;
}


// Abstract error using Error javascript object
abstract class TsBaseError extends Error implements IResultError {
  constructor({ name, message, statusCode }: BaseErrorProps) {
    super(message)
    Object.defineProperty(this, 'name', { value: name })
    Object.defineProperty(this, 'statusCode', { value: statusCode })
  }

  throw(): void {
    throw this;
  }

  pretty(): string {
    return `[${this.name}]: ${this.message}`;
  }
}

// export { RpcBaseError as BaseError };
export { TsBaseError as BaseError };