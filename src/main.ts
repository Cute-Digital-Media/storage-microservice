import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RequestMethod } from '@nestjs/common';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api/v1';

  const port = process.env.APP_PORT || 3000;

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const microservices = [
    { host: 'localhost', port: 3001 },
    { host: 'localhost', port: 3002 },
  ];

  microservices.forEach(({ host, port }) => {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: { host, port },
    });
  });

  setupSwagger(app);
  await app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
