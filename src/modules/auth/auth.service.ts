import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { BetterAuthClient } from './infrastructure/better-auth.client.js';
import type { BetterAuthUser } from './infrastructure/better-auth.client.js';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: BetterAuthClient) {}

  async requestOtp(phoneNumber: string, request: Request) {
    await this.authClient.post('/phone-number/send-otp', { phoneNumber }, request);
    return { EC: 1, EM: 'OTP sent successfully' };
  }

  async register(registerDto: RegisterDto, request: Request) {
    const { userName, phoneNumber, password, otp } = registerDto;
    const result = await this.authClient.post(
      '/phone-number/verify',
      { phoneNumber, code: otp },
      request,
    );

    // OTP tạo user và session; dùng session vừa tạo để đặt mật khẩu lần đầu.
    const user = await this.authClient.completeRegistration(
      userName, password, result.cookies,
    );

    return {
      cookies: result.cookies,
      data: this.createAuthResponse('Register successfully', user),
    };
  }

  async login(loginDto: LoginDto, request: Request) {
    const { phoneNumber, password } = loginDto;
    const result = await this.authClient.post(
      '/sign-in/phone-number',
      { phoneNumber, password },
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
