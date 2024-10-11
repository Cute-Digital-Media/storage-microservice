import { JwtPayload } from '../guards/user-auth.guard';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
