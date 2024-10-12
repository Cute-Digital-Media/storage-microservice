import { Module } from '@nestjs/common';
import { ImagesController } from './infrastructure/images.controller';
import { ImagesService } from './aplication/images.service';
import { FirebaseModule } from 'src/_shared/firabase/firabase.module';
import { QueueModule } from 'src/_shared/queue/queue-board.module';
import { queueEnums } from 'src/_shared/queue/domain/queue-enum.interface';
import { ImageResizeService } from 'src/_shared/aplication/image-resize.service';
import { ImageProcessing } from 'src/_shared/queue/infrastructure/image-processing.service';
import { MathBinaryOperationProcessor } from 'src/_shared/queue/infrastructure/image-processor.service';

@Module({
  imports: [
    FirebaseModule,

    QueueModule.register({
      queues: [queueEnums.ImageSend],
      flows: [],
    }),
  ],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    ImageResizeService,
    ImageProcessing,
    MathBinaryOperationProcessor,
  ],
})
export class ImageModule {}
