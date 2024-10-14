import { NestFactory } from '@nestjs/core';
import { FileGatewayModule } from './file-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvVarsAccessor } from 'libs/common/configs/env-vars-accessor';
import { DbSeeder } from './infrastructure/seed/db-seeder';

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
  await app.listen(EnvVarsAccessor.MS_PORT);
  console.log(`FileGateway microservice is running on: ${await app.getUrl()}`);
  
  const dbSeeder = app.get<DbSeeder>(DbSeeder);
  await dbSeeder.seed(); 
}

bootstrap();
