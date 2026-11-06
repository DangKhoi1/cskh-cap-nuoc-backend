export interface User {
  userId: string;
  userName: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
