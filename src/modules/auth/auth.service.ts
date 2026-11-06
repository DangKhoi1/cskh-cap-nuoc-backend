import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { BetterAuthClient } from './infrastructure/better-auth.client.js';
import type { BetterAuthUser } from './infrastructure/better-auth.client.js';
import { phoneNumberToEmail } from './phone-number.js';

// HTTP facade: map the public auth endpoints to Better Auth.
@Injectable()
export class AuthService {
  constructor(private readonly authClient: BetterAuthClient) {}

  async register(registerDto: RegisterDto, request: Request) {
    const { userName, phoneNumber, password } = registerDto;
    const result = await this.authClient.post(
      '/sign-up/email',
      { name: userName, email: phoneNumberToEmail(phoneNumber), password },
      request,
    );

    return {
      cookies: result.cookies,
      data: this.createAuthResponse('Register successfully', result.user),
    };
  }

  async login(loginDto: LoginDto, request: Request) {
    const { phoneNumber, password } = loginDto;
    const result = await this.authClient.post(
      '/sign-in/email',
      { email: phoneNumberToEmail(phoneNumber), password },
      request,
    );

    return {
      cookies: result.cookies,
      data: this.createAuthResponse('Login successfully', result.user),
    };
  }

  async logout(request: Request) {
    const result = await this.authClient.post('/sign-out', {}, request);

    return {
      cookies: result.cookies,
      data: this.createAuthResponse('Logout successfully'),
    };
  }

  private createAuthResponse(message: string, user?: BetterAuthUser) {
    if (!user) {
      return { EC: 1, EM: message };
    }

    return {
      EC: 1,
      EM: message,
      user: {
        userId: user.id,
        userName: user.name,
        phoneNumber: user.phoneNumber,
        phoneNumberVerified: user.phoneNumberVerified,
      },
    };
  }
}
