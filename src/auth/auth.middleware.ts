// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { AuthService } from "./auth.service";

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private authService: AuthService) {}

//   use(req: any, res: any, next: () => void) {
//     const token = req.cookies?.session;
//     if (token) {
//       const payload = this.authService.decode(token);
//       if (payload) req.user = payload;
//     }
//     next();
//   }
// }


import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private authService: AuthService;

  constructor(private moduleRef: ModuleRef) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.authService) {
      this.authService = this.moduleRef.get(AuthService, { strict: false });
    }

    const token = req.cookies?.session;

        console.log(token)


    if (token && this.authService) {
      try {
        const payload = await this.authService.decode(token);
        console.log(payload)
        if (payload) {
          (req as any).user = payload;
        }
      } catch {
        // invalid token → silently ignore
      }
    }

    next();
  }
}