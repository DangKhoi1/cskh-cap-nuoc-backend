import type { User } from '../../domain/entities/user.entity.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UpdateUserProfile {
  userName: string;
}

export interface UserRepositoryPort {
  findById(userId: string): Promise<User | null>;
  updateProfile(
    userId: string,
    profile: UpdateUserProfile,
  ): Promise<User | null>;
}
