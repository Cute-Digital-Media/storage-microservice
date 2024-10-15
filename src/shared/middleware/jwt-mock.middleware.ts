import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMockMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['authorization'] = 'Bearer mock.token';
    next();
  }
}
