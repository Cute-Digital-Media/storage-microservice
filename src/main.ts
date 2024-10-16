import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { config } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const openApi = new DocumentBuilder()
    .setTitle('Image Microservice')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, openApi);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.PORT);
}
bootstrap();
