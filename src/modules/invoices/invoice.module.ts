import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INVOICE_SOURCE } from './application/ports/invoice-source.port.js';
import { ListUnpaidInvoicesUseCase } from './application/use-cases/list-unpaid-invoices.use-case.js';
import { MockInvoiceSource } from './infrastructure/mock-invoice-source.js';
import { InvoiceController } from './presentation/controllers/invoice.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [InvoiceController],
  providers: [
    ListUnpaidInvoicesUseCase,
    { provide: INVOICE_SOURCE, useClass: MockInvoiceSource },
  ],
})
export class InvoiceModule {}
