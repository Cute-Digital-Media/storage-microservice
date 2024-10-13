import { Module } from '@nestjs/common';
import { ImagesController } from './infrastructure/images.controller';
import { ImagesService } from './aplication/images.service';
import { FirebaseModule } from 'src/_shared/firabase/firabase.module';
import { QueueModule } from 'src/_shared/queue/queue-board.module';
import { QueueEnums } from 'src/_shared/queue/domain/queue-enum.enum';
import { ImageResizeService } from 'src/_shared/aplication/image-resize.service';
import { ImageProcessing } from 'src/_shared/queue/infrastructure/image-processing.service';
import { SendImageProcessor } from 'src/_shared/queue/infrastructure/image-processor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './domain/image.enity';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([ImageEntity]),
    QueueModule.register({
      queues: [QueueEnums.ImageSend],
      flows: [],
    }),
  ],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    ImageResizeService,
    ImageProcessing,
    SendImageProcessor,
  ],
})
export class ImagesModule {}
