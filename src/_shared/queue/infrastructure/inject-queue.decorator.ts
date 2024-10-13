import { InjectQueue } from '@nestjs/bullmq';
import { QueueEnums } from '../domain/queue-enum.enum';

export const InjectImageSendyQueue = () => InjectQueue(QueueEnums.ImageSend);
