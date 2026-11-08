import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { User } from '../../domain/entities/user.entity.js';

@Entity({ name: 'user', synchronize: false })
export class UserEntity implements User {
  @PrimaryColumn({ name: 'id', type: 'text' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'boolean', default: false })
  phoneNumberVerified: boolean;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
