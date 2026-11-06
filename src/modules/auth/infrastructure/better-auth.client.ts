import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { auth } from '../auth.js';

export type BetterAuthUser = typeof auth.$Infer.Session.user;

@Injectable()
export class BetterAuthClient {
  async post(path: string, body: object, request: Request) {
    try {
      const headers = fromNodeHeaders(request.headers);
      headers.set('content-type', 'application/json');
      headers.delete('content-length');

      const url = new URL(`/api/auth${path}`, process.env.BETTER_AUTH_URL);
      const authRequest = new globalThis.Request(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      // Use the handler so Better Auth still applies its origin and rate checks.
      const response = await auth.handler(authRequest);
      const data = await response.json();

      if (!response.ok) {
        let message = 'Authentication failed';
        if (response.status < 500 && data.message) {
          message = data.message;
        }

        throw new HttpException({ EC: 0, EM: message }, response.status);
      }

      return {
        cookies: response.headers.getSetCookie(),
        user: data.user as BetterAuthUser | undefined,
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
