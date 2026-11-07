import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InvoiceSourcePort } from '../application/ports/invoice-source.port.js';
import type { Invoice } from '../domain/invoice.js';

@Injectable()
export class MockInvoiceSource implements InvoiceSourcePort {
  constructor(private readonly config: ConfigService) {}

  async findLinkedCustomerCodes(userId: string): Promise<string[]> {
    if (this.config.get<string>('NODE_ENV') === 'production') {
      throw new ServiceUnavailableException({
        EC: 0,
        EM: 'Invoice provider is not configured',
      });
    }
    // Chỉ tài khoản được cấu hình ở server mới có liên kết mẫu.
    const mockUserId = this.config.get<string>('MOCK_INVOICE_USER_ID');
    return mockUserId && userId === mockUserId ? ['01030001', '01030002'] : [];
  }

  async findInvoices(customerCodes: string[]): Promise<Invoice[]> {
    const invoices: Invoice[] = [
      {
        invoiceId: 'MOCK-001',
        customerCode: '01030001',
        customerName: 'Khách hàng mẫu A',
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
        customerName: 'Khách hàng mẫu A',
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
        customerName: 'Khách hàng mẫu B',
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
        customerName: 'Khách hàng mẫu A',
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
        customerName: 'Khách hàng mẫu B',
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
