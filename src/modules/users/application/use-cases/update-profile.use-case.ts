import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity.js';
import { ProfileError } from '../errors/profile.error.js';
import { USER_REPOSITORY } from '../ports/user.repository.port.js';
import type {
  UpdateUserProfile,
  UserRepositoryPort,
} from '../ports/user.repository.port.js';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string, profile: UpdateUserProfile): Promise<User> {
    const userName = this.validateUserName(profile.userName);
    const user = await this.userRepository.updateProfile(userId, { userName });

    if (!user) {
      throw new ProfileError('USER_NOT_FOUND', 'User not found');
    }

    return user;
  }

  private validateUserName(value: string): string {
    const userName = typeof value === 'string' ? value.trim() : '';

    if (userName.length === 0 || userName.length > 100) {
      throw new ProfileError(
        'INVALID_USER_NAME',
        'userName must contain 1 to 100 characters',
      );
    }

    return userName;
  }
}
