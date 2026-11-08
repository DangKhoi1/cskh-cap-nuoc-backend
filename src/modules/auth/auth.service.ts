import { BadRequestException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { BetterAuthClient } from './infrastructure/better-auth.client.js';
import type { BetterAuthUser } from './infrastructure/better-auth.client.js';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: BetterAuthClient) {}

  async requestOtp(phoneNumber: string, request: Request) {
    await this.authClient.post(
      '/phone-number/send-otp',
      { phoneNumber },
      request,
    );
    return { EC: 1, EM: 'OTP sent successfully' };
  }

  async register(registerDto: RegisterDto, request: Request) {
    const { phoneNumber, password, confirmPassword, otp } = registerDto;
    if (password !== confirmPassword) {
      throw new BadRequestException({
        EC: 0,
        EM: 'Mật khẩu xác nhận không khớp',
      });
    }

    const result = await this.authClient.post(
      '/phone-number/verify',
      { phoneNumber, code: otp },
      request,
    );

    const user = await this.authClient.completeRegistration(
      password,
      result.cookies,
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
        phoneNumber: user.phoneNumber,
        phoneNumberVerified: user.phoneNumberVerified,
      },
    };
  }
}
