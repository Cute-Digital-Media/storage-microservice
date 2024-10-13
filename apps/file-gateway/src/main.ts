import { NestFactory } from '@nestjs/core';
import { FileGatewayModule } from './file-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(FileGatewayModule);
  
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/fileGW');

  const openApi = new DocumentBuilder()
    .setTitle('File Gateway Microservice')
    .setVersion('1.0')
    .build(); 

  const document = SwaggerModule.createDocument(app, openApi);
  SwaggerModule.setup('api/fileGW/docs', app, document);

  await app.startAllMicroservices();
  // get port from envs 
  await app.listen(3000);
  console.log(`FileGateway microservice is running on: ${await app.getUrl()}`);
}

bootstrap();
