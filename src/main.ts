import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();

  await app.listen(process.env.PORT);

  logger.log(`Storage server running on port ${process.env.PORT}`);
}
bootstrap();
