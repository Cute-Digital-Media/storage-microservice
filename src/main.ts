import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Image Storage API')
    .setDescription(`
### Instrucciones para Autenticación JWT:
1. Haz clic en el botón **Authorize** en la parte superior derecha de Swagger UI.
2. Ingresa el siguiente token de ejemplo en el campo de autorización:

   **fake-jwt-token**

3. Después de autorizar, podrás hacer peticiones protegidas por JWT.
  `)
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header', // Asegúrate de que está en el encabezado
      name: 'Authorization', // Nombre del encabezado que Swagger usará
    }, 'JWT-auth')
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Asegura que la autorización persista
    },
  }); // Monta Swagger UI en la ruta /api

  await app.listen(3000);
}
bootstrap();
