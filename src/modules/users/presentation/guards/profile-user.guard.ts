import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { isUUID } from 'class-validator';

export interface ProfileRequest extends Request {
  user: { userId: string };
}

@Injectable()
export class ProfileUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Partial<ProfileRequest>>();
    const userId = request.user?.userId;

    if (typeof userId !== 'string') {
      throw new UnauthorizedException({
        EC: 0,
        EM: 'Unauthorized',
      });
    }

    if (!isUUID(userId)) {
      throw new UnauthorizedException({ EC: 0, EM: 'Unauthorized' });
    }

    return true;
  }
}
