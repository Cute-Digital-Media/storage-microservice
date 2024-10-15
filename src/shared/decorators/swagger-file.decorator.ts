import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

export function ApiUploadImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload an image' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Image uploaded successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid file or validation error',
    }),
  );
}

export function ApiUploadBullImages() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload multiple images' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Images uploaded successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid files or validation error',
    }),
  );
}
