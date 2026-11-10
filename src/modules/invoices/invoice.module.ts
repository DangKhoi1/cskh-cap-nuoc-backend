import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersModule } from '../customers/customers.module.js';
import { INVOICE_SOURCE } from './application/ports/invoice-source.port.js';
import { HistoryInvoicesUseCase } from './application/use-cases/history-invoices.use-case.js';
import { ListUnpaidInvoicesUseCase } from './application/use-cases/list-unpaid-invoices.use-case.js';
import { MockInvoiceSource } from './infrastructure/mock-invoice-source.js';
import { HttpInvoiceSource } from './infrastructure/http-invoice-source.js';
import { InvoiceController } from './presentation/controllers/invoice.controller.js';
import { V2WebhookController } from './presentation/controllers/v2-webhook.controller.js';

@Module({
  imports: [ConfigModule, CustomersModule],
  controllers: [InvoiceController, V2WebhookController],
  providers: [
    ListUnpaidInvoicesUseCase,
    HistoryInvoicesUseCase,
    MockInvoiceSource,
    HttpInvoiceSource,
    {
      provide: INVOICE_SOURCE,
      useFactory: (
        config: ConfigService,
        httpSource: HttpInvoiceSource,
        mockSource: MockInvoiceSource,
      ) => {
        const provider = config.get<string>('V2_PROVIDER', 'mock');
        return provider === 'http' ? httpSource : mockSource;
      },
      inject: [ConfigService, HttpInvoiceSource, MockInvoiceSource],
    },
  ],
})
export class InvoiceModule {}
