import type { Invoice } from '../../domain/invoice.js';
import type { CustomerLink } from '../../domain/customer-link.js';

export const INVOICE_SOURCE = Symbol('INVOICE_SOURCE');

export interface InvoiceSourcePort {
  // Chỉ lấy mã khách hàng đã được xác nhận liên kết với tài khoản này.
  findCustomerLinks(userId: string): Promise<CustomerLink[]>;
  findInvoices(customerCodes: string[]): Promise<Invoice[]>;
}
