import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ProfileError } from '../../application/errors/profile.error.js';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case.js';
import { UpdateProfileRequestDto } from '../dtos/update-profile.request.dto.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
  async getMyProfile(@Session() session: UserSession) {
    try {
      const user = await this.getMyProfileUseCase.execute(session.user.id);
      return { EC: 1, EM: 'Get user profile successfully', user };
    } catch (error: unknown) {
      throw this.toHttpError(error, 'Unable to get profile');
    }
  }

  @Patch('me')
  async updateProfile(
    @Session() session: UserSession,
    @Body() profile: UpdateProfileRequestDto,
  ) {
    try {
      const user = await this.updateProfileUseCase.execute(
        session.user.id,
        profile,
      );
      return { EC: 1, EM: 'Update user profile successfully', user };
    } catch (error: unknown) {
      throw this.toHttpError(error, 'Unable to update profile');
    }
  }

  private toHttpError(error: unknown, fallbackMessage: string): HttpException {
    if (error instanceof ProfileError) {
      const response = { EC: 0, EM: error.message };
      if (error.code === 'USER_NOT_FOUND') {
        return new NotFoundException(response);
      }
      return new BadRequestException(response);
    }

    if (error instanceof HttpException) {
      return error;
    }

    return new InternalServerErrorException({ EC: 0, EM: fallbackMessage });
  }
}
