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

      return res.json({ success: true, message: "Verification code sent" });
    }

    if (!user.verified) {
      await this.userService.update(user.id, {
        verificationCode: code,
        verificationExpires: expires,
      });

      return res.json({ success: true, message: "Verification code re-sent" });
    }

    return res.json({
      success: true,
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
    const user = await this.userService.findById(payload.id);
    return res.json({ user });
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


// @Controller('auth')
// export class AuthController {
//    constructor(
//       private readonly userService: UserService,
//       @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
//    ) { }


//    @Post('signup')
//    async signup(@Body() body: SignUpDto, @Res() res: Response) {
//       const { phone } = body;

//       if (!phone) {
//          return res.status(400).json({ success: false, message: "Phone is required" });
//       }

//       let user = await this.userService.findByPhone(phone);

//       // generate 5-digit code
//       const code = Math.floor(10000 + Math.random() * 90000).toString();

//       if (!user) {
//          // user doesn't exist → create new user
//          user = await this.userService.create({
//             phone,
//             verified: false,
//             verificationCode: code,
//             verificationExpires: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
//          });

//          return res.json({
//             success: true,
//             message: "Verification code sent",
//          });
//       }

//       // user exists but not verified → resend code
//       if (!user.verified) {
//          await this.userService.update(user.id, {
//             verificationCode: code,
//             verificationExpires: new Date(Date.now() + 2 * 60 * 1000),
//          });

//          return res.json({
//             success: true,
//             message: "Verification code re-sent",
//          });
//       }

//       // user exists & verified → no need to sign up again
//       return res.json({
//          success: true,
//          message: "User already verified. You can log in.",
//       });
//    }


//    @Post('verify')
//    async verify(@Body() body: { phone: string; code: string }, @Res() res: Response) {
//       const { phone, code } = body;

//       const user = await this.userService.findByPhone(phone);
//       if (!user) {
//          return res.status(400).json({ success: false, message: "User not found" });
//       }

//       if (user.verified) {
//          return res.json({ success: true, message: "Already verified" });
//       }

//       if (user.verificationCode !== code) {
//          return res.status(400).json({ success: false, message: "Invalid code" });
//       }

//       if (user.verificationExpires < new Date()) {
//          return res.status(400).json({ success: false, message: "Code expired" });
//       }

//       // verification passed → mark user verified
//       await this.userService.update(user.id, {
//          verified: true,
//          verificationCode: null,
//          verificationExpires: null,
//       });

//       // generate JWT
//       const token = this.authService.generateToken(user.id);

//       return res.json({ success: true, token });
//    }



//    @Post('login')
//    async login(@Body() body: LoginDto, @Res() res: Response) {
//       const user: User | null = await this.userService.findByEmail(body.email);
//       if (!user) {
//          return res.status(401).json({
//             success: false,
//             message: MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
//          });
//       }

//       const isMatch = await bcrypt.compare(body.password, user.password);
//       if (!isMatch) {
//          return res.status(401).json({
//             success: false,
//             message: MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
//          });
//       }

//       const token = encrypt({ id: user.id });
//       res.cookie('session', token, {
//          httpOnly: true,
//          path: '/',
//          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//       });

//       const { password, ...safeUser } = user;
//       return res.status(200).json({ data: safeUser });
//    }

//    @Get('profile')
//    async profile(@Req() req: Request, @Res() res: Response) {
//       const token = req.cookies?.session;
//       if (!token) {
//          return res
//             .status(401)
//             .json({ success: false, message: MESSAGES.NOT_LOGGED_IN });
//       }

//       const payload = decrypt(token);
//       if (!payload || !payload['id']) {
//          return res
//             .status(401)
//             .json({ success: false, message: MESSAGES.INVALID_TOKEN });
//       }

//       const user = await this.userService.findById(payload['id']);
//       if (!user) {
//          return res
//             .status(401)
//             .json({ success: false, message: MESSAGES.NOT_LOGGED_IN });
//       }

//       const { password, ...safeUser } = user;
//       return res.json({ user: safeUser });
//    }

//    @Post('logout')
//    async logout(@Res() res: Response) {
//       res.clearCookie('session', { path: '/' });
//       return res
//          .status(200)
//          .json({ success: true, message: MESSAGES.LOGOUT_SUCCESS });
//    }
// }

// @Post('verify-check')
// async verifyCheck(
//    @Body() { code: sentCode, phone }: { code: number; phone: string },
//    @Res() res: Response,
// ) {
//    const cachedCode: number | undefined = await this.cacheManager.get(phone);

//    if (cachedCode === sentCode) {
//       return res.status(200).json({ success: true });
//    }

//    return res.status(401).json({ message: MESSAGES.WRONG_CODE });
// }