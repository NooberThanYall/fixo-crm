import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.cookies?.session;
    if (token) {
      const payload = this.authService.decode(token);
      if (payload) req.user = payload;
    }
    next();
  }
}
