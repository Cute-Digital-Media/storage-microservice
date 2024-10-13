import { Processor } from '@nestjs/bullmq';
import { ImageProcessing } from './image-processing.service';
import { Job } from 'bullmq';
import { WorkerHostProcessor } from './worker-host.process';
import { queueOpsEnums } from '../domain/queue-ops-enum.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IImageJobData } from '../domain/Image-job-data.inerface';
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
  async process(job: Job<IImageJobData, number, string>): Promise<IFirabase> {
    const { file, payload, dto } = job.data;
    switch (job.name) {
      case queueOpsEnums.Send: {
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
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
