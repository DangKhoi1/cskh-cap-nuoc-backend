import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CustomerLinkUseCase } from '../../application/use-cases/customer-link.use-case.js';
import { GetCustomerLinksUseCase } from '../../application/use-cases/get-customer-link.use-case.js';
import { LinkCustomerDto } from '../dtos/link-customer.dto.js';

@Controller('customer-links')
export class CustomerLinkController {
  constructor(
    private readonly customerLinkUseCase: CustomerLinkUseCase,
    private readonly getCustomerLinksUseCase: GetCustomerLinksUseCase,
  ) {}

  @Post()
  async linkCustomer(
    @Session() session: UserSession,
    @Body() dto: LinkCustomerDto,
  ) {
    const user = session?.user as any;
    if (!user?.phoneNumber) {
      throw new UnauthorizedException({
        EC: 0,
        EM: 'Tài khoản chưa có số điện thoại hợp lệ.',
      });
    }

    return this.customerLinkUseCase.execute(
      user.id,
      user.phoneNumber,
      dto.customerCode,
    );
  }

  @Get()
  async getMyCustomerLinks(@Session() session: UserSession) {
    return this.getCustomerLinksUseCase.execute(session.user.id);
  }
}
