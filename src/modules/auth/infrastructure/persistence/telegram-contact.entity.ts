import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('telegram_contact')
export class TelegramContactEntity {
  @PrimaryColumn({ type: 'text' })
  phoneNumber: string;

  @Column({ type: 'text', unique: true })
  telegramUserId: string;

  @Column({ type: 'text' })
  chatId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
