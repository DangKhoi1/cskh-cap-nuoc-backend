import type { Invoice } from '../../domain/invoice.js';

export const INVOICE_SOURCE = Symbol('INVOICE_SOURCE');

export interface InvoiceSourcePort {
  // Chỉ lấy mã khách hàng đã được xác nhận liên kết với tài khoản này.
  findLinkedCustomerCodes(userId: string): Promise<string[]>;
  findInvoices(customerCodes: string[]): Promise<Invoice[]>;
}
