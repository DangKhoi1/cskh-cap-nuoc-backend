import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INVOICE_SOURCE } from '../ports/invoice-source.port.js';
import type { InvoiceSourcePort } from '../ports/invoice-source.port.js';

@Injectable()
export class ListUnpaidInvoicesUseCase {
  constructor(
    @Inject(INVOICE_SOURCE) private readonly source: InvoiceSourcePort,
  ) {}

  async execute(userId: string, linkId?: string) {
    const customerLinks = await this.source.findCustomerLinks(userId);
    const selectedLinks = linkId
      ? customerLinks.filter((link) => link.linkId === linkId)
      : customerLinks;
    if (linkId && !selectedLinks.length) {
      throw new NotFoundException({ EC: 0, EM: 'Customer link not found' });
    }
    const customerCodes = [
      ...new Set(selectedLinks.map((link) => link.customerCode)),
    ];
    const invoices = customerCodes.length
      ? await this.source.findInvoices(customerCodes)
      : [];

    const unpaid = invoices
      .filter(
        (invoice) =>
          invoice.status === 'UNPAID' &&
          selectedLinks.some(
            (link) => link.customerCode === invoice.customerCode,
          ),
      )
      .sort(
        (a, b) =>
          b.billingPeriod.localeCompare(a.billingPeriod) ||
          a.invoiceId.localeCompare(b.invoiceId),
      );

    return {
      customerLinks,
      selectedLinkId: linkId ?? null,
      items: unpaid.map((invoice) => ({
        ...invoice,
        customerLink: selectedLinks.find(
          (link) => link.customerCode === invoice.customerCode,
        )!,
      })),
      total: unpaid.length,
      totalUnpaidAmount: unpaid.reduce(
        (total, invoice) => total + invoice.amount,
        0,
      ),
      currency: 'VND',
    };
  }
}
