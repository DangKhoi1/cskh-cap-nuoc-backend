export class UserProfileDto {
  userId: string;
  userName: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromUser(user: UserProfileDto): UserProfileDto {
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
