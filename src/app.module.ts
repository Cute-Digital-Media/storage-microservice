import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './_shared/image/image.module';
import { ConfigModule } from '@nestjs/config';
import { queueConfig } from './_shared/queue/domain/queue.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImageModule,
    queueConfig,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
