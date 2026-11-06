import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity.js';
import { ProfileError } from '../errors/profile.error.js';
import { USER_REPOSITORY } from '../ports/user.repository.port.js';
import type { UserRepositoryPort } from '../ports/user.repository.port.js';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ProfileError('USER_NOT_FOUND', 'User not found');
    }

    return user;
  }
}
