import { Entity } from 'typeorm';

@Entity('telegram')
export class telegramEnity {
  telegramUserId: string;
  chatId: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
