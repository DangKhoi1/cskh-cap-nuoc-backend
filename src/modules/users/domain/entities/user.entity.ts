import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user', synchronize: false })
export class User {
  @PrimaryColumn({ name: 'id', type: 'text' })
  userId: string;

  @Column({ name: 'name', type: 'text' })
  userName: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
