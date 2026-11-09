import { Inject, Injectable } from '@nestjs/common';
import {
    CUSTOMER_LINK_REPOSITORY,
    type CustomerLinkRepositoryPort,
} from '../ports/customer-link.repository.port.js';
import type { CustomerLink } from '../../domain/entities/customer-link.entity.js';

    @Injectable()
    export class GetCustomerLinksUseCase {
    constructor(
        @Inject(CUSTOMER_LINK_REPOSITORY)
        private readonly customerlinkrepo: CustomerLinkRepositoryPort,
    ) { }

  async execute(userId: string): Promise < CustomerLink[] > {
        const links = await this.customerlinkrepo.findByUserId(userId);
        return links;
    }
}