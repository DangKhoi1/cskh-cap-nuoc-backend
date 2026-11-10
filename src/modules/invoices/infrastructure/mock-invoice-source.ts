import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InvoiceSourcePort } from '../application/ports/invoice-source.port.js';
import type { Invoice } from '../domain/invoice.js';
import type { CustomerLink } from '../domain/customer-link.js';
import {
  CUSTOMER_LINK_REPOSITORY,
  type CustomerLinkRepositoryPort,
} from '../../customers/application/ports/customer-link.repository.port.js';

@Injectable()
export class MockInvoiceSource implements InvoiceSourcePort {
  constructor(
    private readonly config: ConfigService,
    @Inject(CUSTOMER_LINK_REPOSITORY)
    private readonly customerLinkRepo: CustomerLinkRepositoryPort,
  ) { }

  async findCustomerLinks(userId: string): Promise<CustomerLink[]> {
    if (this.config.get<string>('NODE_ENV') === 'production') {
      throw new ServiceUnavailableException({
        EC: 0,
        EM: 'Invoice provider is not configured',
      });
    }

    const realLinks = await this.customerLinkRepo.findByUserId(userId);
    if (realLinks.length > 0) {
      return realLinks.map((link) => ({
        linkId: link.id,
        customerCode: link.customerCode,
        label: link.customerName,
        serviceAddress: link.serviceAddress,
        meterNumber: link.meterNumber ?? '',
      }));
    }

    const mockUserId = this.config.get<string>('MOCK_INVOICE_USER_ID');
    if (mockUserId && userId === mockUserId) {
      return [
        {
          linkId: 'mock-home-1',
          customerCode: '01030001',
          label: 'Nhà 1',
          serviceAddress: '12 Nguyễn Trãi (địa chỉ mẫu)',
          meterNumber: 'DH001',
        },
        {
          linkId: 'mock-home-2',
          customerCode: '01030002',
          label: 'Nhà 2',
          serviceAddress: '35 Lê Lợi (địa chỉ mẫu)',
          meterNumber: 'DH002',
        },
      ];
    }

    return [];
  }

  async findInvoices(customerCodes: string[]): Promise<Invoice[]> {
    const invoices: Invoice[] = [
      {
        invoiceId: 'MOCK-001',
        customerCode: '01030001',
        customerName: 'Nguyen Van An (mock)',
        billingPeriod: '2026-09',
        dueDate: '2026-10-15',
        consumptionM3: 12,
        amount: 120000,
        currency: 'VND',
        status: 'UNPAID',
      },
      {
        invoiceId: 'MOCK-002',
        customerCode: '01030001',
        customerName: 'Nguyen Van An (mock)',
        billingPeriod: '2026-10',
        dueDate: '2026-11-15',
        consumptionM3: 15,
        amount: 150000,
        currency: 'VND',
        status: 'UNPAID',
      },
      {
        invoiceId: 'MOCK-003',
        customerCode: '01030002',
        customerName: 'Nguyen Van An (mock)',
        billingPeriod: '2026-10',
        dueDate: '2026-11-15',
        consumptionM3: 8,
        amount: 80000,
        currency: 'VND',
        status: 'UNPAID',
      },
      {
        invoiceId: 'MOCK-004',
        customerCode: '01030001',
        customerName: 'Nguyen Van An (mock)',
        billingPeriod: '2026-08',
        dueDate: '2026-09-15',
        consumptionM3: 10,
        amount: 100000,
        currency: 'VND',
        status: 'PAID',
      },
      {
        invoiceId: 'MOCK-005',
        customerCode: '01030002',
        customerName: 'Nguyen Van An (mock)',
        billingPeriod: '2026-09',
        dueDate: '2026-10-15',
        consumptionM3: 9,
        amount: 90000,
        currency: 'VND',
        status: 'CANCELLED',
      },
    ];

    return invoices.filter((invoice) =>
      customerCodes.includes(invoice.customerCode),
    );
  }
}
