import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class UploadFileInterceptor implements NestInterceptor {
  constructor() {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (!req.file) {
      throw new Error('File not found');
    }
    if (
      req.file.mimetype !== 'image/jpeg' &&
      req.file.mimetype !== 'image/png' &&
      req.file.mimetype !== 'image/webp'
    ) {
      throw new Error('File type not supported');
    }
    return next.handle();
  }
}
