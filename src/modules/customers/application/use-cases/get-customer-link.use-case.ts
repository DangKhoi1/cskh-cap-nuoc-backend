import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_LINK_REPOSITORY,
  type CustomerLinkRepositoryPort,
} from '../ports/customer-link.repository.port.js';

@Injectable()
export class GetCustomerLinksUseCase {
  constructor(
    @Inject(CUSTOMER_LINK_REPOSITORY)
    private readonly customerLinkRepo: CustomerLinkRepositoryPort,
  ) {}

  async execute(userId: string) {
    const links = await this.customerLinkRepo.findByUserId(userId);
    return {
      EC: 1,
      EM: 'Lấy danh sách khách hàng liên kết thành công.',
      data: links,
    };
  }
}
