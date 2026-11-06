import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity.js';
import type { UserProfileDto } from '../../application/dtos/user-profile.dto.js';
import type {
  UpdateUserProfile,
  UserRepositoryPort,
} from '../../application/ports/user.repository.port.js';

@Injectable()
export class BetterAuthUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(userId: string): Promise<UserProfileDto | null> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      return null;
    }

    return this.toProfile(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserProfile,
  ): Promise<UserProfileDto | null> {
    const result = await this.userRepository.update(
      { userId },
      {
        userName: dto.userName,
        updatedAt: new Date(),
      },
    );

    if (!result.affected) {
      return null;
    }

    return this.findById(userId);
  }

  private toProfile(user: User): UserProfileDto {
    return {
      userId: user.userId,
      userName: user.userName,
      phoneNumber: null,
      phoneNumberVerified: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
