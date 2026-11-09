import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CUSTOMER_LINK_REPOSITORY,
  type CustomerLinkRepositoryPort,
} from '../ports/customer-link.repository.port.js';
import {
  V2_CUSTOMER_PORT,
  type V2CustomerPort,
} from '../ports/v2-customer.port.js';

@Injectable()
export class CustomerLinkUseCase {
  constructor(
    @Inject(CUSTOMER_LINK_REPOSITORY)
    private readonly linkRepo: CustomerLinkRepositoryPort,
    @Inject(V2_CUSTOMER_PORT)
    private readonly v2Port: V2CustomerPort,
  ) {}

  async execute(userId: string, phoneNumber: string, customerCode: string) {
    const existing = await this.linkRepo.findByUserAndCode(userId, customerCode);
    if (existing) {
      throw new ConflictException({
        EC: 0,
        EM: 'This customerCode is already linked with your account',
      });
    }

    const v2Profile = await this.v2Port.verifyAndGetCustomer(
      customerCode,
      phoneNumber,
    );
    if (!v2Profile) {
      throw new BadRequestException({
        EC: 0,
        EM: 'customerCode or phoneNumber is does not match our water utility records',
      });
    }

    const newLink = await this.linkRepo.save({
      userId,
      customerCode: v2Profile.customerCode,
      customerName: v2Profile.customerName,
      serviceAddress: v2Profile.serviceAddress,
      meterNumber: v2Profile.meterNumber,
    });

    return {
      EC: 1,
      EM: 'Success! Your customer account has been linked to your user profile.',
      data: newLink,
    };
  }
}
