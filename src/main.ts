import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './@config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Image Storage Microservice')
    .setDescription('The Image Storage Microservice API description')
    .setVersion('1.0')
    .addTag('Image Storage Microservice')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(envs.port);
}
bootstrap();
