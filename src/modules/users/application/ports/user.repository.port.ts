import type { UserProfileDto } from '../dtos/user-profile.dto.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UpdateUserProfile {
  userName: string;
}

export interface UserRepositoryPort {
  findById(userId: string): Promise<UserProfileDto | null>;
  updateProfile(
    userId: string,
    profile: UpdateUserProfile,
  ): Promise<UserProfileDto | null>;
}
