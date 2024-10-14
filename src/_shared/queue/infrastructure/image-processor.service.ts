import { Processor } from '@nestjs/bullmq';
import { ImageProcessing } from './image-processing.service';
import { Job } from 'bullmq';
import { WorkerHostProcessor } from './worker-host.process';
import { queueOpsEnums } from '../domain/queue-ops-enum.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IImageSendJobData,
  IImageDeleteJobData,
} from '../domain/Image-job-data.inerface';
import { ImagesService } from 'src/images/aplication/images.service';
import { IFirabase } from '../domain/firebase.interface';
import { QueueEnums } from '../domain/queue-enum.enum';

@Processor(QueueEnums.ImageSend)
@Injectable()
export class SendImageProcessor extends WorkerHostProcessor {
  constructor(
    private readonly imageProcessing: ImageProcessing,
    private readonly imagesService: ImagesService,
  ) {
    super();
  }
  async process(
    job: Job<IImageSendJobData | IImageDeleteJobData, number, string>,
  ): Promise<IFirabase | boolean> {
    switch (job.name) {
      case queueOpsEnums.Send: {
        const { file, payload, dto } = job.data as IImageSendJobData;
        const { url, fileName, folderPath }: IFirabase =
          await this.imageProcessing.handleResizeAndSend(
            file,
            payload.userId,
            dto.folder_name,
            payload.tenantId,
          );
        await this.imagesService.save({
          user_id: payload.userId,
          folder_name: dto.folder_name,
          file_name: fileName,
          folder_path: folderPath,
          tenant_id: payload.tenantId,
          url: url,
        });

        return { url, fileName, folderPath };
      }
      case queueOpsEnums.Delete: {
        const { fileName, folderPath, id } = job.data as IImageDeleteJobData;
        if (await this.imagesService.deleteFile(fileName, folderPath)) {
          try {
            await this.imagesService.delete({ id });
          } catch {
            console.log(
              'Error deleting photo. Someone else did it before the action was completed',
            );
          }
          return true;
        }
      }
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
