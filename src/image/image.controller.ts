import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Put, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './providers/image.service';
import { UpdateImageDto } from './dto/updateimage.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../auth/enums/rol.enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/uploadimage.dto';
import { PagiantionQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadImageWithFileDto } from './dto/photo.dto';

@ApiTags('images')
@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Post('upload')
    @Roles(Rol.ADMIN)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload an image' })
    @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
    @ApiBody({
        description: 'Upload Image',
        type: UploadImageWithFileDto,
    })
    public async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
        @Body() uploadImage: UploadImageDto,
    ): Promise<string> {
        const userId: string = req.user.id;
        const tenant: string = req.user.tenant;
        const url = await this.imageService.uploadImage(file, tenant, userId, uploadImage);
        return url;
    }

    @Get('get/:id')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Get an image by ID' })
    @ApiResponse({ status: 200, description: 'Image found.' })
    @ApiResponse({ status: 404, description: 'Image not found.' })
    public async getImage(@Param('id') id: number): Promise<string> {
        return this.imageService.findOne(id);
    }

    @Get('all-by-userid')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'List all images by user ID' })
    @ApiResponse({ status: 200, description: 'List of images.' })
    public async listImagesbyUserId(
        @Request() req,
        @Query() pagiantionQueryDto: PagiantionQueryDto
    ): Promise<string[]> {
        const userId = req.user.id; // Cambié userId de req.userId a req.user.id
        return this.imageService.findAllByUserId(userId, pagiantionQueryDto);
    }

    @Get('all-by-tenant')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'List all images by tenant' })
    @ApiResponse({ status: 200, description: 'List of images.' })
    public async listImagesByUserTenant(
        @Request() req,
        @Query() pagiantionQueryDto: PagiantionQueryDto
    ): Promise<string[]> {
        const tenant = req.user.tenant;
        return this.imageService.findAllByUserTenant(tenant, pagiantionQueryDto);
    }

    @Get('all-by-folder/:folder')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'List all images by folder' })
    @ApiResponse({ status: 200, description: 'List of images.' })
    public async listImagesByFolder(
        @Request() req,
        @Param('folder') folder: string,
        @Query() pagiantionQueryDto: PagiantionQueryDto
    ): Promise<string[]> {
        const userId = req.user.id;
        return this.imageService.findAllByFolder(userId, folder, pagiantionQueryDto);
    }

    @Put('update')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Update an image' })
    @ApiResponse({ status: 200, description: 'Image updated successfully.' })
    public async updateImage(@Body() updateImageDto: UpdateImageDto): Promise<Image> {
        return this.imageService.update(updateImageDto);
    }

    @Delete('delete/:id')
    @Roles(Rol.ADMIN, Rol.USER)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Delete an image by ID' })
    @ApiResponse({ status: 200, description: 'Image deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Image not found.' })
    public async deleteImage(@Param('id') id: number, @Request() req): Promise<boolean> {
        const userId = req.user.id;
        return this.imageService.remove(id, userId);
    }
}
