import { Module } from '@nestjs/common';
import { FileGateWayControllers } from './presentation/controllers/controllers';
import { CommonModule } from 'libs/common';
import { ApplicationServices } from './application/services/application.services';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { MapperProfiles } from './infrastructure/mappers/profiles/mappers.profiles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersistenceEntities } from './infrastructure/persistence/persistence';
import { RepositoryProviders } from './infrastructure/repositories/repositories';
import { EnvVarsAccessor } from 'libs/common/configs/env-vars-accessor';
import { config } from 'dotenv';
import { FileCommandHandlers } from './application/features/file/commands/file.commands';
import { FileQueries } from './application/features/file/queries/file.queries';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ExternalServicesProviders } from './infrastructure/external-services/external-services';
import { DbSeeder } from './infrastructure/seed/db-seeder';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuditLogEvents } from './application/features/audit-log/events/audit-log.events';
config();
@Module({
  imports: [
    CommonModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(), 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: EnvVarsAccessor.DB_HOST,               
      port: +EnvVarsAccessor.DB_HOST,
      username: EnvVarsAccessor.DB_USER_NAME,
      password: EnvVarsAccessor.DB_PASSWORD,       
      database: 'file-gateway',    
      entities: PersistenceEntities,
      synchronize: true,
      logging: true,                   
    }),
    TypeOrmModule.forFeature(PersistenceEntities),
    MulterModule.register({
      storage: memoryStorage()
    }),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${EnvVarsAccessor.REDIS_HOST}:${EnvVarsAccessor.REDIS_PORT}`,
    }),
  ],
  controllers: FileGateWayControllers,
  providers: [
    ...ApplicationServices, 
    ...MapperProfiles,
    ...FileCommandHandlers, 
    ...FileQueries, 
    ...AuditLogEvents, 
    ...RepositoryProviders, 
    ...ExternalServicesProviders, 
    DbSeeder
  ],
})
export class FileGatewayModule {}
