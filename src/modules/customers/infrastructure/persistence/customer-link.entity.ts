import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    ManyToOne,
    JoinColumn,
    type Relation,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/infrastructure/persistence/user.entity.js';

@Entity('customer_links')
@Unique(['userId', 'customerCode'])
export class CustomerLinkEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    userId: string;

    @Column({ type: 'text' })
    customerCode: string;

    @Column({ type: 'text' })
    customerName: string;

    @Column({ type: 'text' })
    serviceAddress: string;

    @Column({ type: 'text', nullable: true })
    meterNumber: string | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Relation<UserEntity>;
}