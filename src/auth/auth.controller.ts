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
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  // ----------------------
  // SIGNUP — front calls /auth/signup
  // ----------------------
  @Post('signup')
  async signup(@Body() body: { phone: string }, @Res() res: Response) {
    const { phone } = body;

    if (!phone || phone.length !== 11) {
      return res.status(400).json({ success: false, message: "Invalid phone" });
    }

    let user = await this.userService.findByPhone(phone);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 2 * 60 * 1000);

    if (!user) {
      user = await this.userService.create({
        phone,
        verified: false,
        verificationCode: code,
        verificationExpires: expires,
      });

      return res.status(200).json({ success: true, message: "Verification code sent" });
    }

    if (!user.verified) {
      await this.userService.update(user.id, {
        verificationCode: code,
        verificationExpires: expires,
      });

      return res.json({ success: false, message: "Verification code re-sent" });
    }

    // when the user exists and is verified.

    return res.json({
      success: false,
      message: "User already verified",
    });
  }

  // ----------------------
  // VERIFY — front calls /auth/verify-code
  // ----------------------
  @Post('verify-code')
  async verify(@Body() body: { phone: string; code: string }, @Res() res: Response) {
    const { phone, code } = body;

    const user = await this.userService.findByPhone(phone);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.verified) {
      return res.json({ success: true, message: "Already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // @ts-expect-error fuck

    if (user.verificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    await this.userService.update(user.id, {
      verified: true,
      verificationCode: null,
      verificationExpires: null,
    });

    const token = this.authService.generateToken(user.id);

    res.cookie("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ success: true });
  }

  @Post('complete-profile')
  async completeProfile(
    @Body() body: Partial<User>,
    @Req() req: any,
    @Res() res: Response
  ) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const userId = req.user.id;

    await this.userService.update(userId, body);

    return res.json({ success: true });
  }


  // ----------------------
  // LOGIN — front calls /auth/login
  // BUT it expects login WITH phone
  // ----------------------
  @Post('login')
  async login(@Body() body: { phone: string }, @Res() res: Response) {
    const user = await this.userService.findByPhone(body.phone);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (!user.verified) {
      return res.status(401).json({ success: false, message: "User not verified" });
    }

    const token = this.authService.generateToken(user.id);

    res.cookie("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ success: true, user });
  }

  // ----------------------
  // PROFILE
  // ----------------------
  @Get("profile")
  async profile(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.session;
    if (!token)
      return res.status(401).json({ success: false, message: "Not logged in" });

    const payload = this.authService.decode(token);
    if (!payload)
      return res.status(401).json({ success: false, message: "Invalid token" });

    //@ts-expect-error fuck ya
    const user: User = await this.userService.findById(payload.id);
    return res.json({ user: {...user, password: null} });
  }


  // ----------------------
  // LOGOUT
  // ----------------------
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie("session", { path: "/" });
    return res.json({ success: true });
  }
}
