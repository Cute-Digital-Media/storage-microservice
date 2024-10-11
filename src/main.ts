import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //Documentation Swagger
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  const config = new DocumentBuilder()
    .setTitle('Image Service API')
    .setDescription('API to upload and manage images.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  console.log(`Server is running on port ${PORT}`);
}
bootstrap();
