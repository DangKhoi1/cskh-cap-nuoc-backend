import { Controller, Get, Query } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { HistoryInvoicesUseCase } from '../../application/use-cases/history-invoices.use-case.js';
import { ListUnpaidInvoicesUseCase } from '../../application/use-cases/list-unpaid-invoices.use-case.js';
import { ListInvoicesDto } from './dtos/list-invoices.dto.js';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly listUnpaid: ListUnpaidInvoicesUseCase,
    private readonly historyInvoices: HistoryInvoicesUseCase,
  ) {}

  @Get('unpaid')
  async getUnpaid(
    @Session() session: UserSession,
    @Query() query: ListInvoicesDto,
  ) {
    return this.listUnpaid.execute(
      session.user.id,
      query.linkId,
      query.page,
      query.limit,
    );
  }

  @Get('history')
  async getInvoicesHistory(
    @Session() session: UserSession,
    @Query() query: ListInvoicesDto,
  ) {
    return this.historyInvoices.execute(
      session.user.id,
      query.linkId,
      query.page,
      query.limit,
    );
  }
}
