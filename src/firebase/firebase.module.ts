import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AuthModule } from '../auth/auth.module';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import firebaseConfig from '../config/firebase.config';


@Module({
    providers: [FirebaseService],
    exports: [FirebaseService],
    imports: [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider()), AuthModule,
    ConfigModule.forRoot({
        load: [firebaseConfig], // Carga la configuración de Firebase
    }),
    ]
})
export class FirebaseModule {

}
