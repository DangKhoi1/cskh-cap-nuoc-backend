import { Inject, Injectable } from '@nestjs/common';
import { INVOICE_SOURCE } from '../ports/invoice-source.port.js';
import type { InvoiceSourcePort } from '../ports/invoice-source.port.js';

@Injectable()
export class ListUnpaidInvoicesUseCase {
  constructor(
    @Inject(INVOICE_SOURCE) private readonly source: InvoiceSourcePort,
  ) {}

  async execute(userId: string, page: number, limit: number) {
    const customerCodes = await this.source.findLinkedCustomerCodes(userId);
    const invoices = customerCodes.length
      ? await this.source.findInvoices(customerCodes)
      : [];

    const unpaid = invoices
      .filter(
        (invoice) =>
          invoice.status === 'UNPAID' &&
          customerCodes.includes(invoice.customerCode),
      )
      .sort(
        (a, b) =>
          a.dueDate.localeCompare(b.dueDate) ||
          a.invoiceId.localeCompare(b.invoiceId),
      );

    return {
      items: unpaid.slice((page - 1) * limit, page * limit),
      page,
      limit,
      total: unpaid.length,
      totalPages: Math.ceil(unpaid.length / limit),
      totalUnpaidAmount: unpaid.reduce(
        (total, invoice) => total + invoice.amount,
        0,
      ),
      currency: 'VND',
    };
  }
}
