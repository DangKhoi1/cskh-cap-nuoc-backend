import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case.js';
import { UpdateProfileRequestDto } from '../dtos/update-profile.request.dto.js';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
@Controller('users')
export class UserController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
  getMyProfile(@Session() session: UserSession) {
    const userId = session.user.id;
    return this.getMyProfileUseCase.execute(userId);
  }

  @Patch('me')
  updateProfile(
    @Session() session: UserSession,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    const userId = session.user.id;
    return this.updateProfileUseCase.execute(userId, dto);
  }
}
