import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { auth } from './auth.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  register(dto: RegisterDto, request: Request) {
    return this.sendAuthRequest(
      '/sign-up/email',
      {
        name: dto.userName,
        email: dto.email,
        password: dto.password,
      },
      request,
      'Register successfully',
    );
  }

  login(dto: LoginDto, request: Request) {
    return this.sendAuthRequest(
      '/sign-in/email',
      {
        email: dto.email,
        password: dto.password,
      },
      request,
      'Login successfully',
    );
  }

  logout(request: Request) {
    return this.sendAuthRequest(
      '/sign-out',
      {},
      request,
      'Logout successfully',
    );
  }

  private async sendAuthRequest(
    path: string,
    body: object,
    request: Request,
    message: string,
  ) {
    try {
      const headers = fromNodeHeaders(request.headers);
      headers.set('content-type', 'application/json');
      headers.delete('content-length');
      // Use the handler so Better Auth still applies its origin and rate checks.
      const response = await auth.handler(
        new globalThis.Request(
          new URL(`/api/auth${path}`, process.env.BETTER_AUTH_URL),
          { method: 'POST', headers, body: JSON.stringify(body) },
        ),
      );
      const data = await response.json();

      if (!response.ok) {
        throw new HttpException(
          {
            EC: 0,
            EM:
              response.status >= 500
                ? 'Authentication failed'
                : data.message || 'Authentication failed',
          },
          response.status,
        );
      }

      return {
        cookies: response.headers.getSetCookie(),
        data: {
          EC: 1,
          EM: message,
          ...(data.user
            ? {
                user: {
                  userId: data.user.id,
                  userName: data.user.name,
                  email: data.user.email,
                },
              }
            : {}),
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        EC: 0,
        EM: 'Authentication failed',
      });
    }
  }
}
