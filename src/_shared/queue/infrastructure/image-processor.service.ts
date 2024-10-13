import { Processor } from '@nestjs/bullmq';
import { ImageProcessing } from './image-processing.service';
import { Job } from 'bullmq';
import { WorkerHostProcessor } from './worker-host.process';
import { queueEnums } from '../domain/queue-enum.interface';
import { queueOpsEnums } from '../domain/queue-ops-enum.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageJobData } from '../domain/Image-job-data.inerface';
import { ImagesService } from 'src/images/aplication/images.service';

@Processor(queueEnums.ImageSend)
@Injectable()
export class MathBinaryOperationProcessor extends WorkerHostProcessor {
  constructor(
    private readonly imageProcessing: ImageProcessing,
    private readonly imagesService: ImagesService,
  ) {
    super();
  }
  async process(job: Job<ImageJobData, number, string>): Promise<number> {
    const { file, payload, dto } = job.data;
    switch (job.name) {
      case queueOpsEnums.Send: {
        const url: string = await this.imageProcessing.handleResizeAndSend(
          file,
          payload.userId,
          dto.folder_name,
          payload.tenantId,
        );
        try {
          await this.imagesService.save({
            user_id: payload.userId,
            file_name: dto.folder_name,
            tenant_id: payload.tenantId,
            url: url,
          });
        } catch (e) {
          const sf = 0;
        }
      }
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
