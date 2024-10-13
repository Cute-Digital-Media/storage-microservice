import { Processor } from '@nestjs/bullmq';
import { ImageProcessing } from './image-processing.service';
import { Job } from 'bullmq';
import { WorkerHostProcessor } from './worker-host.process';
import { queueEnums } from '../domain/queue-enum.interface';
import { queueOpsEnums } from '../domain/queue-ops-enum.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageJobData } from '../domain/Image-job-data.inerface';

@Processor(queueEnums.ImageSend)
@Injectable()
export class MathBinaryOperationProcessor extends WorkerHostProcessor {
  constructor(private imageProcessing: ImageProcessing) {
    super();
  }
  async process(job: Job<ImageJobData, number, string>): Promise<number> {
    const { file, tenantId } = job.data;
    const { user_id, folder_name } = job.data.dto;
    switch (job.name) {
      case queueOpsEnums.Send:
        return await this.imageProcessing.handleResizeAndSend(
          file,
          user_id,
          folder_name,
          tenantId,
        );
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
