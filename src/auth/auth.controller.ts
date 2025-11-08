import { Body, Controller, Post, Res, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { encrypt, decrypt } from 'src/utils/jwt';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
   constructor(private userService: UserService) { }

   @Post('signup')
   async signup(@Body() body: any, @Res() res: Response) {
      const existingUser = await this.userService.findByEmail(body.email);
      if (existingUser) {
         return res
            .status(400)
            .json({ success: false, message: 'کاربر وجود دارد' });
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await this.userService.create({
         ...body,
         password: hashedPassword,
      });

      return res.status(200).json({ user });
   }

   @Post('login')
   async login(@Body() body: any, @Res() res: Response) {
      const user: User | null = await this.userService.findByEmail(body.email);
      if (!user) {
         return res
            .status(401)
            .json({ success: false, message: 'ایمیل یا پسورد نادرست' });
      }

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
         return res
            .status(401)
            .json({ success: false, message: 'ایمیل یا پسورد نادرست' });
      }

      const token = encrypt({ id: user.id });

      res.cookie("session", token, {
         httpOnly: true,
         path: '/',
         maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({ data: { ...user, passwordHash: null } });
   }

   @Get('profile')
   async profile(@Req() req: Request, @Res() res: Response) {
      const token = req.cookies?.session;
      console.log(req.cookies)
      if (!token)
         return res.status(401).json({ success: false, message: 'Not logged in' });

      const payload = decrypt(token);
      if (!payload)
         return res.status(401).json({ success: false, message: 'Invalid token' });

      const user = await this.userService.findById(payload['id']);
      return res.json({ user: { ...user, passwordHash: null } });
   }

   @Post('logout')
   async logout(@Res() res: Response) {
      res.clearCookie('session', { path: '/' });
      return res.status(200).json({ success: true, message: 'خروج موفق' });
   }
}