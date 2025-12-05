// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    //@ts-expect-error fuck you  
    if (request.user) {
      return true; 
    }

    return false; 
  }
}

// -------------------------- old guard with user setter ---------------------- //


// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import type { Request } from 'express';
// import { decrypt } from '../utils/jwt'; 

// @Injectable()
// export class AuthGuard implements CanActivate {
//    async canActivate(context: ExecutionContext): Promise<boolean> {
//       const req = context.switchToHttp().getRequest<Request>();

//       const token = req.cookies?.session; // session cookie

//       if (!token) {
//          throw new UnauthorizedException('No token provided');
//       }

//       try {
//          const decoded = decrypt(token); // verify jwt
//          if (!decoded) {
//             throw new UnauthorizedException('Invalid token');
//          }

//          // attach decoded data to request so controller can use it
//          (req as any).user = decoded;

//          return true; // allow the request
//       } catch (err) {
//          throw new UnauthorizedException('Unauthorized');
//       }
//    }
// }
