import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    Logger.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
  await app.listen(3000);
}
bootstrap();
