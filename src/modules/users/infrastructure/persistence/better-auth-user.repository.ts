import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity.js';
import type { User } from '../../domain/entities/user.entity.js';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port.js';

@Injectable()
export class BetterAuthUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      return null;
    }

    return this.toProfile(user);
  }

  private toProfile(user: UserEntity): User {
    return {
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      phoneNumberVerified: user.phoneNumberVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
