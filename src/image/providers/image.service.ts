import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirebaseService } from '../../firebase/firebase.service'; // Asegúrate de que la ruta sea correcta
import { Image } from '../image.entity'; // Ajusta según tu estructura
import { UpdateImageDto } from '../dto/updateimage.dto';
import sharp from 'sharp';
import { UsersService } from '../../users/providers/users.service';
import { UploadImageDto } from '../dto/uploadimage.dto';
import { PagiantionQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import { RedisClientType } from '@redis/client';


@Injectable()
export class ImageService {

    private redisClient: RedisClientType;

    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly firebaseService: FirebaseService,
        private readonly userServices: UsersService,) {
    }
    public async uploadImage(
        file: Express.Multer.File,
        tenant: string,
        userId: string,
        uploadImageDto: UploadImageDto
    ): Promise<string> {

        // Procesar la imagen para optimización
        const optimizedBuffer = await this.optimizeImage(file.buffer);

        // Crear la ruta de almacenamiento utilizando tenant y userId
        const filePath = `${tenant}/${userId}/${uploadImageDto.folder}/${file.originalname}`;

        // Subir la imagen optimizada a Firebase usando la ruta creada
        const url = await this.firebaseService.uploadImage(filePath, optimizedBuffer);

        const thumbnailBuffer = await this.generateThumbnail(optimizedBuffer);
        const thumbnailPath = `${tenant}/${userId}/${uploadImageDto.folder}/thumb_${file.originalname}`;
        const thumbnailUrl = await this.firebaseService.uploadImage(thumbnailPath, thumbnailBuffer);

        // Verificar si la imagen ya existe
        const existingImage = await this.imageRepository.findOne({ where: { url } });
        if (existingImage) {
            throw new ConflictException('Image already exists');
        }
        const user = await this.userServices.getById(parseInt(userId))

        // Crear y guardar la entrada en la base de datos con la URL de la imagen
        const image = this.imageRepository.create({
            ...uploadImageDto,
            tenant: tenant,
            user: user,
            url: url,
            thumbnailUrl: thumbnailUrl,
        });
        await this.imageRepository.save(image)
        return url
    }

    private async optimizeImage(buffer: Buffer): Promise<Buffer> {
        return sharp(buffer)
            .resize({ width: 800, height: 600, fit: 'inside' }) // Ajusta el tamaño según tus necesidades
            .toBuffer();
    }
    private async generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
        return await sharp(imageBuffer)
            .resize(150, 150) // Ajusta el tamaño del thumbnail según tus necesidades
            .toBuffer();
    }

    // Método para obtener una imagen por ID
    public async findOne(id: number): Promise<string> {
        const image = await this.imageRepository.findOneBy({
            id: id
        });
        if (!image) {
            throw new NotFoundException('Image not found');
        }
        return image.url;
    }

    // Método para actualizar una imagen
    public async update(updateImageDto: UpdateImageDto): Promise<Image> {
        const image = await this.imageRepository.findOneBy({
            id: updateImageDto.id
        })// Verifica si existe

        // Actualiza solo la descripción 
        if (updateImageDto.description) {
            image.description = updateImageDto.description;
        }

        return this.imageRepository.save(image);
    }

    // Método para eliminar una imagen
    public async remove(id: number, userId: number): Promise<boolean> {
        const image = await this.imageRepository.findOneBy({
            id: id,
            user: { id: userId }
        })
        if (!image) {
            throw new BadRequestException('No existe la imagen o usted no es el propietario');
        }
        // Eliminar la imagen de Firebase
        await this.firebaseService.deleteImage(image.url);

        // Eliminar la entrada de la base de datos
        await this.imageRepository.delete(id);

        return true
    }

    public async findAllByUserId(userId: number, pagiantionQueryDto: PagiantionQueryDto,): Promise<string[]> {
        const images: Image[] = await this.imageRepository.find({
            where: {
                user: { id: userId }, // Filtrar por userId
            },
            skip: (pagiantionQueryDto.page - 1) * pagiantionQueryDto.limit, // Calcular el desplazamiento
            take: pagiantionQueryDto.limit, // Limitar el número de resultados
        });

        // Extraer solo las URLs
        return images.map(image => image.url);
    }

    public async findAllByUserTenant(tenant: string, pagiantionQueryDto: PagiantionQueryDto,): Promise<string[]> {
        const images: Image[] = await this.imageRepository.find({
            where: {
                user: { tenant: tenant }, // Filtrar por userId
            },
            skip: (pagiantionQueryDto.page - 1) * pagiantionQueryDto.limit, // Calcular el desplazamiento
            take: pagiantionQueryDto.limit, // Limitar el número de resultados
        });

        // Extraer solo las URLs
        return images.map(image => image.url);
    }


    public async findAllByFolder(userId: number, folder: string, pagiantionQueryDto: PagiantionQueryDto,): Promise<string[]> {
        const images: Image[] = await this.imageRepository.find({
            where: {
                user: { id: userId },
                folder: folder
            },
            skip: (pagiantionQueryDto.page - 1) * pagiantionQueryDto.limit, // Calcular el desplazamiento
            take: pagiantionQueryDto.limit, // Limitar el número de resultados
        });

        // Extraer solo las URLs
        return images.map(image => image.url);
    }

}
