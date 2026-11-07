import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ListUnpaidInvoicesUseCase } from '../../application/use-cases/list-unpaid-invoices.use-case.js';
import { ListInvoicesDto } from '../dtos/list-invoices.dto.js';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly listUnpaid: ListUnpaidInvoicesUseCase) {}

  @Get('unpaid')
  async getUnpaid(
    @Session() session: UserSession,
    @Query() query: ListInvoicesDto,
  ) {
    try {
      const data = await this.listUnpaid.execute(
        session.user.id,
        query.page,
        query.limit,
      );
      return {
        EC: 1,
        EM: 'Get unpaid invoices successfully',
        source: 'mock',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        EC: 0,
        EM: 'Unable to get unpaid invoices',
      });
    }
  }
}
