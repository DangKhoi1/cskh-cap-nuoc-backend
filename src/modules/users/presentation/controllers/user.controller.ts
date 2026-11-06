import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case.js';
import { UpdateProfileRequestDto } from '../dtos/update-profile.request.dto.js';
import { ProfileUserGuard } from '../guards/profile-user.guard.js';
import type { ProfileRequest } from '../guards/profile-user.guard.js';

@Controller('users')
@UseGuards(ProfileUserGuard)
export class UserController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
  async getMyProfile(@Req() request: ProfileRequest) {
    const userId = request.user.userId;
    const user = await this.getMyProfileUseCase.execute(userId);

    return {
      EC: 1,
      EM: 'Get user profile successfully',
      user,
    };
  }

  @Patch('me')
  async updateProfile(
    @Req() request: ProfileRequest,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    const userId = request.user.userId;
    const user = await this.updateProfileUseCase.execute(userId, dto);

    return {
      EC: 1,
      EM: 'Update user profile successfully',
      user,
    };
  }
}
