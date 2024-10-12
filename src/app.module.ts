import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeormModule } from './modules/config/typeorm/typeorm.module';
import { EnvModule } from './modules/config/env/env.module';

@Module({
  imports: [UserModule, TypeormModule, EnvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
