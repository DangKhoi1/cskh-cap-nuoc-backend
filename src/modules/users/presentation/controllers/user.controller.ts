import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ProfileError } from '../../application/errors/profile.error.js';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';

@Controller('users')
export class UserController {
  constructor(private readonly getMyProfileUseCase: GetMyProfileUseCase) {}

  @Get('me')
  async getMyProfile(@Session() session: UserSession) {
    try {
      const user = await this.getMyProfileUseCase.execute(session.user.id);
      return { EC: 1, EM: 'Get user profile successfully', user };
    } catch (error: unknown) {
      throw this.toHttpError(error, 'Unable to get profile');
    }
  }

  private toHttpError(error: unknown, fallbackMessage: string): HttpException {
    if (error instanceof ProfileError) {
      const response = { EC: 0, EM: error.message };
      return new NotFoundException(response);
    }

    if (error instanceof HttpException) {
      return error;
    }

    return new InternalServerErrorException({ EC: 0, EM: fallbackMessage });
  }
}
