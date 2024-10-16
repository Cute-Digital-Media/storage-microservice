import { Injectable, Logger } from '@nestjs/common';

export interface LoggerServiceI {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

@Injectable()
export class LoggerService extends Logger implements LoggerServiceI {
  constructor() {
    super();
    // Aquí puedes inicializar la conexión a un sistema externo de logging,
    // como AWS CloudWatch, Elasticsearch, o cualquier otra plataforma de logs.
    // O implementar un repositorio para guárdalos en una base de datos si se desea.
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }

  log(message: string): void {
    super.log(this.formatMessage(message));
  }

  error(message: string): void {
    super.error(this.formatMessage(message));
  }

  warn(message: string): void {
    super.warn(this.formatMessage(message));
  }
}
