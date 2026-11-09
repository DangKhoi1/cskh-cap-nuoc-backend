import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../ports/user.repository.port.js';
import type { UserRepositoryPort } from '../ports/user.repository.port.js';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException({ EC: 0, EM: 'User not found' });
    }

    return {
      EC: 1,
      EM: 'Get user profile successfully',
      user,
    };
  }
}
