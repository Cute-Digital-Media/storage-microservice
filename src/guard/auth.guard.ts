import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Simulating a mock token extraction from the Authorization header
    const authHeader = request.headers['authorization'];
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];

      if (token === 'mocked-jwt-token') { // send this token to evaluate this pass
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        
        request.user = {
          id: '123',
          username: `Mock_User_${randomNumber}`,
          role: 'admin',
        };

        return true;
      }
    }

    return false; // If no token or invalid token, access is denied
  }
}
