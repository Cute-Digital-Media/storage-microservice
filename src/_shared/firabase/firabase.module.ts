// firebase.module.ts
import { Module, Global } from '@nestjs/common';
import admin from 'firebase-admin';

@Global() // Decorador @Global para que el módulo sea accesible globalmente
@Module({
  // imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN', // Nombre del provider
      useFactory: (): admin.app.App => { // Función que crea la instancia de Firebase Admin

        const firebaseConfig = {
          credential: admin.credential.cert({
            //type: process.env.FIREBASE_TYPE,
            projectId: process.env.FIREBASE_PROJECT_ID,
            // project_id: process.env.FIREBASE_PROJECT_ID, // Include snake_case for Firebase
            // privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // clientId: process.env.FIREBASE_CLIENT_ID,
            // authUri: process.env.FIREBASE_AUTH_URI,
            // tokenUri: process.env.FIREBASE_TOKEN_URI,
            // authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
            // clientX509CertUrl: process.env.FIREBASE_CERT_URL,
            // universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN
          }),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
          storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
        };

        return admin.apps.length
        ? admin.app()
        : admin.initializeApp(firebaseConfig);
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'], // Exporta el provider para que pueda ser inyectado en otros módulos
})
export class FirebaseModule {}