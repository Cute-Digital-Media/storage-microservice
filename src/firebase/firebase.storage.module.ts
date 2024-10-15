import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageDBE } from 'src/db/entities/image.db.entity';
import { FirebaseStorageController } from './firebase.storage.controller';
import { FirebaseStorageService } from './firebase.storage.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([ImageDBE]), JwtModule],
    controllers: [FirebaseStorageController],
    providers: [FirebaseStorageService],
    exports: [FirebaseStorageService],
})
export class FirebaseStorageModule { };
