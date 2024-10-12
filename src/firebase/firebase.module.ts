import { Module } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseService } from './firebase.service';

@Module({
    providers: [FirebaseProvider, FirebaseService],
    exports: [FirebaseService], // Exportamos el servicio para que se pueda inyectar en otros lugares
})
export class FirebaseModule { }
