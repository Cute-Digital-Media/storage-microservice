import { Injectable } from '@nestjs/common';
import { envConfig } from './domain/envConfig.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService implements envConfig {
  constructor(private configService: ConfigService) {}
  getDatabaseHost(): string {
    return this.configService.get('DATABASE_HOST');
  }

  getDatabaseName(): string {
    return this.configService.get('DATABASE_NAME');
  }

  getDatabasePassword(): string {
    return this.configService.get('DATABASE_PASSWORD');
  }

  getDatabasePort(): number {
    return this.configService.get('DATABASE_PORT');
  }

  getDatabaseType(): string {
    return this.configService.get('DATABASE_TYPE');
  }

  getDatabaseUser(): string {
    return this.configService.get('DATABASE_USERNAME');
  }
}
