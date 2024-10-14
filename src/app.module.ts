import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './modules/images/images.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './modules/images/entities/image.entity';
import { FirebaseModule } from './modules/firebase/firebase.module';
import logger from './logger';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Image],
      synchronize: true,
    }),
    ImagesModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        logger.info(`Request... ${req.method} ${req.url}`);
        next();
      })
      .forRoutes('*');
  }
}
