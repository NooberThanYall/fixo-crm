import {
   Body,
   Controller,
   Post,
   Res,
   Get,
   Req,
   NotFoundException,
   Inject,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { encrypt, decrypt } from 'src/utils/jwt';
import { User } from '../user/entities/user.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MESSAGES } from '../common/constants/ErrorMessages';

@Controller('auth')
export class AuthController {
   constructor(
      private readonly userService: UserService,
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
   ) { }

   @Post('signup')
   async signup(@Body() body: any, @Res() res: Response) {
      const existingUser = await this.userService.findByEmail(body.email);
      if (existingUser) {
         return res
            .status(400)
            .json({ success: false, message: MESSAGES.USER_EXISTS });
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await this.userService.create({
         ...body,
         password: hashedPassword,
         verified: false,
      });

      return res.status(200).json({ user });
   }

   @Post('verify-code')
   async verify(@Body() { phone }: { phone: string }) {
      const user: User | null = await this.userService.findByPhone(phone);
      if (!user) {
         throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }

      const code: number = Math.floor(Math.random() * 10000);
      await this.cacheManager.set(phone, code, 120000); // 2 minutes
      console.log('Verification Code:', code);

      return { success: true, message: 'کد ارسال شد' };
   }

   @Post('verify-check')
   async verifyCheck(
      @Body() { code: sentCode, phone }: { code: number; phone: string },
      @Res() res: Response,
   ) {
      const cachedCode: number | undefined = await this.cacheManager.get(phone);

      if (cachedCode === sentCode) {
         return res.status(200).json({ success: true });
      }

      return res.status(401).json({ message: MESSAGES.WRONG_CODE });
   }

   @Post('login')
   async login(@Body() body: any, @Res() res: Response) {
      const user: User | null = await this.userService.findByEmail(body.email);
      if (!user) {
         return res.status(401).json({
            success: false,
            message: MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
         });
      }

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
         return res.status(401).json({
            success: false,
            message: MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
         });
      }

      const token = encrypt({ id: user.id });
      res.cookie('session', token, {
         httpOnly: true,
         path: '/',
         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      const { password, ...safeUser } = user;
      return res.status(200).json({ data: safeUser });
   }

   @Get('profile')
   async profile(@Req() req: Request, @Res() res: Response) {
      const token = req.cookies?.session;
      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: MESSAGES.NOT_LOGGED_IN });
      }

      const payload = decrypt(token);
      if (!payload || !payload['id']) {
         return res
            .status(401)
            .json({ success: false, message: MESSAGES.INVALID_TOKEN });
      }

      const user = await this.userService.findById(payload['id']);
      if (!user) {
         return res
            .status(401)
            .json({ success: false, message: MESSAGES.NOT_LOGGED_IN });
      }

      const { password, ...safeUser } = user;
      return res.json({ user: safeUser });
   }

   @Post('logout')
   async logout(@Res() res: Response) {
      res.clearCookie('session', { path: '/' });
      return res
         .status(200)
         .json({ success: true, message: MESSAGES.LOGOUT_SUCCESS });
   }
}