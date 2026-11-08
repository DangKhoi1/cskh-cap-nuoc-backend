export interface User {
  userId: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
