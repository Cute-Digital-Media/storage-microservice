import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ListFileDto } from './Dto/list.file.dto';
import { UploadFileDto } from './Dto/upload.file.dto';
import { FirebaseStorageService } from './firebase.storage.service';
import { SharpPipe } from './pipe/sharp.pipe';

@Controller('file')
@UseGuards(AuthGuard)
export class FirebaseStorageController {
    public constructor(private readonly firebaseStorageService: FirebaseStorageService) { };

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(SharpPipe) file: Express.Multer.File,
        @Body() uploadFileDto: UploadFileDto,
        @Res() res: Response,
    ) {
        if (!file) {
            return this.handleError(res, new BadRequestException('file is required'));
        }

        try {
            const imageUrl = await this.firebaseStorageService.uploadFile(file, uploadFileDto);
            return this.handleSuccess(res, imageUrl);
        } catch (error) {
            return this.handleError(res, new InternalServerErrorException('File upload failed', error.message));
        }
    }

    @Get(':id')
    async getFileById(
        @Param('id', ParseIntPipe) fileId: number,
        @Res() res: Response,
    ) {
        try {
            const imageUrl = await this.firebaseStorageService.getFileById(fileId);
            res
                .status(200)
                .json({ message: 'image retrieved successfully', url: imageUrl });
        } catch (error) {
            res
                .status(404)
                .json({ message: error.message });
        };
    }

    @Get()
    async listImages(
        @Query() filters: ListFileDto,
        @Res() res: Response,
    ) {
        try {
            const files = await this.firebaseStorageService.findAll(filters);

            res
                .status(200)
                .json(files);
        } catch (error) {
            res
                .status(404)
                .json({ message: error.message });
        }
    }

    @Delete(':id')
    async deleteById(
        @Param('id', ParseIntPipe) fileId: number,
        @Res() res: Response,
    ) {
        try {
            const imageUrl = await this.firebaseStorageService.deleteFile(fileId);
            res
                .status(200)
                .json({ message: 'image deleted successfully', url: imageUrl });
        } catch (error) {
            res
                .status(404)
                .json({ message: error.message });
        };
    }

    private handleSuccess(res: Response, imageUrl: string) {
        res.status(200).json({ message: 'Image uploaded successfully', url: imageUrl });
    }

    private handleError(res: Response, error: Error) {
        res.status(error instanceof BadRequestException ? 400 : 500).json({ error: error.message });
    }

}