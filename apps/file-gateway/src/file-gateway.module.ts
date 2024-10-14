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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExternalServicesProviders } from './infrastructure/external-services/external-services';

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
    MulterModule.register({
      storage: diskStorage({
          destination: './uploads', // Carpeta de destino para los archivos
          filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
              cb(null, `${uniqueSuffix}-${file.originalname}`);
          }
      })
  }),
  ],
  controllers: FileGateWayControllers,
  providers: [
    ...ApplicationServices, 
    ...MapperProfiles,
    ...FileCommandHandlers, 
    ...FileQueries, 
    ...RepositoryProviders, 
    ...ExternalServicesProviders
  ],
})
export class FileGatewayModule {}
