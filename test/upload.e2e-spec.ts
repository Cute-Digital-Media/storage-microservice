import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module'; // Ajusta la ruta según tu estructura
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import path from 'path';
import { Tenant } from 'firebase-admin/lib/auth/tenant';



describe('ImageController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();

    });

    afterAll(async () => {
        await app.close();
    });




    it('should upload an image', async () => {

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ username: 'admin2@gmail.com', password: 'maXS@sdasd1234' }) // Ajusta estos valores según tu lógica
            .expect(200);

        const cookies = loginResponse.headers['set-cookie'] as unknown as string[]; // Asegúrate de que sea un array
        const tokenCookie = cookies.find(cookie => cookie.startsWith('jwt='));
        const jwtToken = tokenCookie ? tokenCookie.split(';')[0] : '';



        const uploadImageDto = {
            folder: 'test_folder',
            tenant: "test",
            userId: "2",
            description: 'Test image description',
        };
        console.log(jwtToken)
        const imagePath = path.join(__dirname, '../src/Thunder.jpg'); // Asegúrate de que la ruta sea correcta
        const simulatedImage = fs.readFileSync(imagePath);


        await request(app.getHttpServer()).post('/images/upload')
            .set('Cookie', jwtToken) // Añadir el token de autenticación
            .attach('file', simulatedImage, { filename: 'test.jpg', contentType: 'image/jpeg' })// Simula el contenido de la imagen
            .field('tenant', uploadImageDto.tenant) // Usar el tenant extraído de la cookie
            .field('userId', uploadImageDto.userId) // Usar el userId extraído de la cookie
            .field('folder', uploadImageDto.folder) // Enviar el campo 'folder'
            .field('description', uploadImageDto.description) // Enviar el campo 'description'
            .expect(201); // Espera un estado 201 (Created)



    });
});
