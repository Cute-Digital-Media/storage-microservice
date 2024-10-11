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
    const { file } = job.data;
    switch (job.name) {
      case queueOpsEnums.Send:
      await this.imageProcessing.handleResizeAndSend(job.data.file);
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}