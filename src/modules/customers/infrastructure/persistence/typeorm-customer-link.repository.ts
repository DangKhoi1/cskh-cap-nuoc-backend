import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CustomerLink } from '../../domain/entities/customer-link.entity.js';
import type { CustomerLinkRepositoryPort } from '../../application/ports/customer-link.repository.port.js';
import { CustomerLinkEntity } from './customer-link.entity.js';

@Injectable()
export class TypeOrmCustomerLinkRepository implements CustomerLinkRepositoryPort {
    constructor(
        @InjectRepository(CustomerLinkEntity)
        private readonly repo: Repository<CustomerLinkEntity>,
    ) { }

    async findByUserId(userId: string): Promise<CustomerLink[]> {
        return this.repo.find({ where: { userId } });
    }

    async findByUserAndCode(userId: string, customerCode: string): Promise<CustomerLink | null> {
        return this.repo.findOne({ where: { userId, customerCode } });
    }

    async save(link: Omit<CustomerLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerLink> {
        const entity = this.repo.create(link);
        return this.repo.save(entity);
    }
}