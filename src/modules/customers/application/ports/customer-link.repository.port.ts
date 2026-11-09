import { CustomerLink } from '../../domain/entities/customer-link.entity.js';

export const CUSTOMER_LINK_REPOSITORY = Symbol('CUSTOMER_LINK_REPOSITORY');

export interface CustomerLinkRepositoryPort {
    findByUserId(userId: string): Promise<CustomerLink[]>;
    save(link: Omit<CustomerLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerLink>;
    findByUserAndCode(userId: string, customerCode: string): Promise<CustomerLink | null>;
}