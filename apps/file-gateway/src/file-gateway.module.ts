import { Module } from '@nestjs/common';
import { FileGateWayControllers } from './presentation/controllers/controllers';
import { CommonModule } from 'libs/common';
import { ApplicationServices } from './application/services/application.services';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { MapperProfiles } from './infrastructure/mappers/profiles/mappers.profiles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persistence } from './infrastructure/persistence/persistence';
import { Repositories } from './infrastructure/repositories/repositories';

@Module({
  imports: [
    CommonModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(), 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',               
      port: 5432,
      username: 'tu_usuario',
      password: 'tu_contraseña',       
      database: 'nombre_bd',    
      entities: Persistence,
      synchronize: true,
      logging: true,                   
    }),
    TypeOrmModule.forFeature(Repositories),
  ],
  controllers: FileGateWayControllers,
  providers: [
    ...ApplicationServices, 
    ...MapperProfiles 
  ],
})
export class FileGatewayModule {}
