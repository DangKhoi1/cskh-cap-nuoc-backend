import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileDto } from '../dtos/user-profile.dto.js';
import { USER_REPOSITORY } from '../ports/user.repository.port.js';
import type { UserRepositoryPort } from '../ports/user.repository.port.js';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserProfileDto> {
    try {
      const user = await this.userRepository.findById(userId);

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
        EM: 'Unable to get profile',
      });
    }
  }
}
