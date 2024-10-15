import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule { }
