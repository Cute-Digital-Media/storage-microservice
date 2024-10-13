import { Module } from '@nestjs/common';
import { FileGateWayControllers } from './presentation/controllers/controllers';
import { CommonModule } from 'libs/common';
import { ApplicationServices } from './application/services/application.services';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { MapperProfiles } from './infrastructure/mappers/profiles/mappers.profiles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persistence } from './infrastructure/persistence/persistence';
import { PersistenceEntities, RepositoryProviders } from './infrastructure/repositories/repositories';
import { EnvVarsAccessor } from 'libs/common/configs/env-vars-accessor';
import { config } from 'dotenv';
import { FileCommandHandlers } from './application/features/file/commands/file.commands';
import { FileQueries } from './application/features/file/queries/file.queries';

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
      entities: Persistence,
      synchronize: true,
      logging: true,                   
    }),
    TypeOrmModule.forFeature(PersistenceEntities),
  ],
  controllers: FileGateWayControllers,
  providers: [
    ...ApplicationServices, 
    ...MapperProfiles,
    ...FileCommandHandlers, 
    ...FileQueries, 
    ...RepositoryProviders 
  ],
})
export class FileGatewayModule {}
