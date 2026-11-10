import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INVOICE_SOURCE } from '../ports/invoice-source.port.js';
import type { InvoiceSourcePort } from '../ports/invoice-source.port.js';

@Injectable()
export class ListUnpaidInvoicesUseCase {
  constructor(
    @Inject(INVOICE_SOURCE)
    private readonly source: InvoiceSourcePort,
  ) {}

  async execute(userId: string, linkId?: string, page?: string, limit?: string) {
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
      EC: 1,
      EM: 'Get unpaid invoices successfully',
      source: 'mock',
      data: {
        selectedLinkId: linkId ?? null,
        customerLinks,
        invoices: unpaid.map((invoice) => ({
          invoiceId: invoice.invoiceId,
          customerName: invoice.customerName,
          property: selectedLinks.find(
            (link) => link.customerCode === invoice.customerCode,
          )!,
          billingPeriod: invoice.billingPeriod,
          dueDate: invoice.dueDate,
          oldIndex: invoice.oldIndex,
          newIndex: invoice.newIndex,
          consumptionM3: invoice.consumptionM3,
          amount: invoice.amount,
          currency: invoice.currency,
          status: invoice.status,
        })),
        summary: {
          totalInvoices: unpaid.length,
          totalUnpaidAmount: unpaid.reduce(
            (total, invoice) => total + invoice.amount,
            0,
          ),
          currency: 'VND',
        },
      },
    };
  }
}
