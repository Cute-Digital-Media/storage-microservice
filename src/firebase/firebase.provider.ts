import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

export const FirebaseProvider: Provider = {
    provide: 'FIREBASE_ADMIN',
    useFactory: () => {
        if (admin.apps.length === 0) {
            return admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
            });
        }
        return admin.app();
    },
};
