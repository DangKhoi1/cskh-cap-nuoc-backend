import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INVOICE_SOURCE } from './application/ports/invoice-source.port.js';
import { HistoryInvoicesUseCase } from './application/use-cases/history-invoices.use-case.js';
import { ListUnpaidInvoicesUseCase } from './application/use-cases/list-unpaid-invoices.use-case.js';
import { MockInvoiceSource } from './infrastructure/mock-invoice-source.js';
import { InvoiceController } from './presentation/controllers/invoice.controller.js';
import { V2WebhookController } from './presentation/controllers/v2-webhook.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [InvoiceController, V2WebhookController],
  providers: [
    ListUnpaidInvoicesUseCase,
    HistoryInvoicesUseCase,
    { provide: INVOICE_SOURCE, useClass: MockInvoiceSource },
  ],
})
export class InvoiceModule {}
