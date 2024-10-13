import { InjectQueue } from '@nestjs/bullmq';
import { queueEnums } from '../domain/queue-enum.interface';

export const InjectImageSendyQueue = () => InjectQueue(queueEnums.ImageSend);
