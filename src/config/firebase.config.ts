import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
    id: process.env.FIREBASE_PROJECT_ID,
}));