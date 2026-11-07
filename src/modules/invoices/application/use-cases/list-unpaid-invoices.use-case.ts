import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INVOICE_SOURCE } from '../ports/invoice-source.port.js';
import type { InvoiceSourcePort } from '../ports/invoice-source.port.js';

@Injectable()
export class ListUnpaidInvoicesUseCase {
  constructor(
    @Inject(INVOICE_SOURCE) private readonly source: InvoiceSourcePort,
  ) {}

  async execute(userId: string, page: number, limit: number, linkId?: string) {
    const customerLinks = await this.source.findCustomerLinks(userId);
    const selectedLinks = linkId
      ? customerLinks.filter((link) => link.linkId === linkId)
      : customerLinks;
    if (linkId && !selectedLinks.length) {
      throw new NotFoundException({ EC: 0, EM: 'Customer link not found' });
    }
    const servicePointIds = [
      ...new Set(selectedLinks.map((link) => link.servicePointId)),
    ];
    const invoices = servicePointIds.length
      ? await this.source.findInvoices(servicePointIds)
      : [];

    const unpaid = invoices
      .filter(
        (invoice) =>
          invoice.status === 'UNPAID' &&
          selectedLinks.some(
            (link) =>
              link.servicePointId === invoice.servicePointId &&
              link.customerCode === invoice.customerCode,
          ),
      )
      .sort(
        (a, b) =>
          a.dueDate.localeCompare(b.dueDate) ||
          a.invoiceId.localeCompare(b.invoiceId),
      );

    return {
      customerLinks,
      selectedLinkId: linkId ?? null,
      items: unpaid.slice((page - 1) * limit, page * limit).map((invoice) => ({
        ...invoice,
        customerLink: selectedLinks.find(
          (link) =>
            link.servicePointId === invoice.servicePointId &&
            link.customerCode === invoice.customerCode,
        )!,
      })),
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
