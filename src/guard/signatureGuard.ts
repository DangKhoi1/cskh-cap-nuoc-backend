import {
  CanActivate,
  ExecutionContext,
  RawBodyRequest,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express'

export class SignatureGuard implements CanActivate {
  private readonly SECRET_KEY = process.env.V2_SHARED_SECRET;
  private readonly MAX_AGE_MS = 5 * 60 * 1000;
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<Request>>();
    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    if (!signature) {
      throw new UnauthorizedException('Missing signature header');
    }

    if (!timestamp) {
      throw new UnauthorizedException('Missing timestamp header')
    }

    const reqTime = Number(timestamp);
    if (isNaN(reqTime) || Math.abs(Date.now() - reqTime) > this.MAX_AGE_MS) {
      throw new UnauthorizedException('Request expired or invalid timestamp')
    }

    // Nếu không có body (như GET) thì dùng Buffer rỗng để băm
    const bodyToSign = request.rawBody ?? Buffer.from('');

    const expectedSignature = crypto
      .createHmac('sha256', this.SECRET_KEY as string)
      .update(timestamp)
      .update(bodyToSign)
      .digest('hex');
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException('Invalid signature');
    }
    return true;
  }
}
