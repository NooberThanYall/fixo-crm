import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [AuthService, AuthMiddleware]
})
export class AuthModule {}
