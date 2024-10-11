import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
