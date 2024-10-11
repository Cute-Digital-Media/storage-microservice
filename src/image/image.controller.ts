import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { JwtPayload, UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const { user_id, tenant } = req.user as JwtPayload;
    const folderName = 'uploads';
    const imageId = file.filename.split('.')[0];
    return await this.imageService.uploadImage(
      file,
      tenant,
      user_id,
      folderName,
      imageId,
    );
  }

  @Get(':term')
  async getImage(
    @Param('term') term: string,
  ): Promise<{ url: string; name: string; id: string }> {
    return this.imageService.getImage(term);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getAllImages(
    @Query('tenant') tenant?: string,
    @Query('userId') userId?: string,
    @Query('folderName') folderName?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    images: { name: string; id: string; url: string }[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.imageService.getAllImages(
      tenant,
      userId,
      folderName,
      page,
      limit,
    );
  }

  @Delete(':imageId')
  async deleteImage(@Param('imageId') imageId: string): Promise<string> {
    await this.imageService.deleteImage(imageId);
    return `Image ${imageId} deleted succesfully`;
  }
}
