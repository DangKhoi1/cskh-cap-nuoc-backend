import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INVOICE_SOURCE } from '../ports/invoice-source.port.js';
import type { InvoiceSourcePort } from '../ports/invoice-source.port.js';

@Injectable()
export class HistoryInvoicesUseCase {
  constructor(
    @Inject(INVOICE_SOURCE)
    private readonly source: InvoiceSourcePort,
  ) {}

  async execute(userId: string, linkId?: string) {
    const customerLinks = await this.source.findCustomerLinks(userId);
    const selectedLinks = linkId
      ? customerLinks.filter((link) => link.linkId === linkId)
      : customerLinks;

    if (linkId && selectedLinks.length === 0) {
      throw new NotFoundException({ EC: 0, EM: 'Customer link not found' });
    }

    const customerCodes = [
      ...new Set(selectedLinks.map((link) => link.customerCode)),
    ];
    const invoices = customerCodes.length
      ? await this.source.findInvoices(customerCodes)
      : [];

    const history = invoices
      .filter(
        (invoice) =>
          invoice.status !== 'CANCELLED' &&
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
      items: history.map((invoice) => ({
        ...invoice,
        customerLink: selectedLinks.find(
          (link) => link.customerCode === invoice.customerCode,
        )!,
      })),
      total: history.length,
    };
  }
}
