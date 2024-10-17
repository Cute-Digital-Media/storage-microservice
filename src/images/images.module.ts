import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerService } from 'src/logs/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ClientsModule.register([
      {
        name: 'IMAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, LoggerService],
})
export class ImagesModule {}
