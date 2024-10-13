import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [CommonService, ],
  exports: [CommonService, CqrsModule],
  
})
export class CommonModule {}
