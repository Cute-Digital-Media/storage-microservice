import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './@config/envs';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { ImagesModule } from './images/images.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.postgres_host,
      port: envs.postgres_port,
      username: envs.postgres_user,
      password: envs.postgres_pass,
      database: envs.postgres_db,
      autoLoadEntities: true,
      entities: [User],
      synchronize: true,
      migrations: ['src/migrations/*.ts'],
    }),
    UsersModule,
    AuthModule,
    ImagesModule,
    FirebaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
