import { Controller, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';

@Controller('users')
export class UserController {
  constructor(private readonly getMyProfileUseCase: GetMyProfileUseCase) {}

  @Get('me')
  async getMyProfile(@Session() session: UserSession) {
    return this.getMyProfileUseCase.execute(session.user.id);
  }
}
