// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // Ensure this is explicitly typed as 'string' if there's any ambiguity,
  // though the '|| "super-secret"' should technically make it a string.
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || "super-secret";

  generateToken(userId: string) {
    return jwt.sign({ id: userId }, this.JWT_SECRET, { // this.JWT_SECRET is guaranteed to be a string
      expiresIn: "7d",
    });
  }

  decode(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET); // this.JWT_SECRET is guaranteed to be a string
    } catch (err) {
      return null;
    }
  }
}