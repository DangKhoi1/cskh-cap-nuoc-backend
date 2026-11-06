import type { User } from '../../domain/entities/user.entity.js';

export class UserProfileDto {
  userId: string;
  userName: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromUser(user: User): UserProfileDto {
    return {
      userId: user.userId,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      phoneNumberVerified: user.phoneNumberVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
