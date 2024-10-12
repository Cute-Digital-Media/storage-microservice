import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { PageOptionsDto } from './dto/page.options.dto';

@Auth(Role.USER)
@Controller('images')
export class ImagesController {
  constructor(readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @ActiveUser() user: UserActiveInterface,
    @UploadedFile() file,
  ) {
    const result = await this.imagesService.saveImageAndThumbnail(file, user);
    return { message: 'Image uploaded successfully', data: result };
  }

  @Get('url/:fileName')
  async getImageUrl(
    @Param('fileName') fileName,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const result = await this.imagesService.getImageUrl(fileName, user);
    return { message: 'Image url fetched successfully', data: result };
  }

  @Get('all/pagination')
  async getAllImagesWithPagination(
    @Query() pageOptionsDto: PageOptionsDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const result = await this.imagesService.getAllImagesUrlWithPagination(
      pageOptionsDto,
      user,
    );
    return { message: 'Images fetched successfully', data: result };
  }

  // delete image
  @Get('delete/:fileName')
  async deleteImage(
    @Param('fileName') fileName,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const result = await this.imagesService.deleteImage(fileName, user);
    return { message: 'Image deleted successfully', data: result };
  }
}
