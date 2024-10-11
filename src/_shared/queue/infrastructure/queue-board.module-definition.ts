import { ConfigurableModuleBuilder } from '@nestjs/common';
import { QueueBoardModuleOptions } from '../domain/queue-board.interface';

export const { ConfigurableModuleClass, 
MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();