import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firabase/firabase.module';
import { ImageController } from './infrastructure/image.controller';
import { ImageService } from './aplication/image.service';
import { QueueModule } from '../queue/queue-board.module';
import { queueEnums } from '../queue/domain/queue-enum.interface';
import { MathBinaryOperationProcessor } from '../queue/infrastructure/image-processor.service';
import { ImageProcessing } from '../queue/infrastructure/image-processing.service';
import { ImageResizeService } from '../aplication/image-resize.service';

@Module({
  imports: [FirebaseModule, 

    QueueModule.register({
      queues: [queueEnums.ImageSend],
      flows: [],
    }),
  ], controllers: [ImageController],
  providers: [ImageService, ImageResizeService, ImageProcessing, MathBinaryOperationProcessor],
})
export class ImageModule {}
