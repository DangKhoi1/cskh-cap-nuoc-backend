import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity.js';
import type {
  UpdateUserProfile,
  UserRepositoryPort,
} from '../../application/ports/user.repository.port.js';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findById(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userId });
  }

  async updateProfile(
    userId: string,
    profile: UpdateUserProfile,
  ): Promise<User | null> {
    const result = await this.userRepository.update(
      { userId },
      { userName: profile.userName },
    );

    if (!result.affected) {
      return null;
    }

    return this.findById(userId);
  }
}
