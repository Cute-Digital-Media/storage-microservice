import { InjectQueue } from '@nestjs/bullmq';
import { QueueEnums } from '../domain/queue-enum.enum';

export const InjectImageQueue = () => InjectQueue(QueueEnums.ImageSend);
