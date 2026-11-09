import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { HistoryInvoicesUseCase } from '../../application/use-cases/history-invoices.use-case.js';
import { ListUnpaidInvoicesUseCase } from '../../application/use-cases/list-unpaid-invoices.use-case.js';
import { ListInvoicesDto } from '../dtos/list-invoices.dto.js';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly listUnpaid: ListUnpaidInvoicesUseCase,
    private readonly historyInvoices: HistoryInvoicesUseCase,
  ) { }

  @Get('unpaid')
  async getUnpaid(
    @Session() session: UserSession,
    @Query() query: ListInvoicesDto,
  ) {
    try {
      const data = await this.listUnpaid.execute(session.user.id, query.linkId);
      return {
        EC: 1,
        EM: 'Get unpaid invoices successfully',
        source: 'mock',
        data: {
          selectedLinkId: data.selectedLinkId,
          customerLinks: data.customerLinks,
          invoices: data.items.map((invoice) => ({
            invoiceId: invoice.invoiceId,
            customerName: invoice.customerName,
            property: invoice.customerLink,
            billingPeriod: invoice.billingPeriod,
            dueDate: invoice.dueDate,
            consumptionM3: invoice.consumptionM3,
            amount: invoice.amount,
            currency: invoice.currency,
            status: invoice.status,
          })),
          summary: {
            totalInvoices: data.total,
            totalUnpaidAmount: data.totalUnpaidAmount,
            currency: data.currency,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        EC: 0,
        EM: 'Unable to get unpaid invoices',
      });
    }
  }

  @Get('history')
  async getInvoicesHistory(
    @Session() session: UserSession,
    @Query() query: ListInvoicesDto,
  ) {
    try {
      const data = await this.historyInvoices.execute(
        session.user.id,
        query.linkId,
      );

      return {
        EC: 1,
        EM: 'Get invoice history successfully',
        source: 'mock',
        data: {
          selectedLinkId: data.selectedLinkId,
          customerLinks: data.customerLinks,
          invoices: data.items.map((invoice) => ({
            invoiceId: invoice.invoiceId,
            customerName: invoice.customerName,
            property: invoice.customerLink,
            billingPeriod: invoice.billingPeriod,
            dueDate: invoice.dueDate,
            consumptionM3: invoice.consumptionM3,
            amount: invoice.amount,
            currency: invoice.currency,
            status: invoice.status,
          })),
          summary: {
            totalInvoices: data.total,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        EC: 0,
        EM: 'Unable to get invoice history',
      });
    }
  }
}
