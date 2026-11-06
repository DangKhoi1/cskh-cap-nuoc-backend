import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileDto } from '../dtos/user-profile.dto.js';
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

  async execute(
    userId: string,
    dto: UpdateUserProfile,
  ): Promise<UserProfileDto> {
    try {
      if (typeof dto.userName !== 'string') {
        throw new BadRequestException({
          EC: 0,
          EM: 'userName must contain 1 to 100 characters',
        });
      }

      const userName = dto.userName.trim();

      if (!userName || userName.length > 100) {
        throw new BadRequestException({
          EC: 0,
          EM: 'userName must contain 1 to 100 characters',
        });
      }

      const user = await this.userRepository.updateProfile(userId, {
        userName,
      });

      if (!user) {
        throw new NotFoundException({ EC: 0, EM: 'User not found' });
      }

      return UserProfileDto.fromUser(user);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        EC: 0,
        EM: 'Unable to update profile',
      });
    }
  }
}
