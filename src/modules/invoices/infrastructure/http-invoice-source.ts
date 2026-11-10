import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import type { InvoiceSourcePort } from '../application/ports/invoice-source.port.js';
import type { Invoice } from '../domain/invoice.js';
import type { CustomerLink } from '../domain/customer-link.js';
import {
  CUSTOMER_LINK_REPOSITORY,
  type CustomerLinkRepositoryPort,
} from '../../customers/application/ports/customer-link.repository.port.js';

@Injectable()
export class HttpInvoiceSource implements InvoiceSourcePort {
  private readonly logger = new Logger(HttpInvoiceSource.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(
    private readonly config: ConfigService,
    @Inject(CUSTOMER_LINK_REPOSITORY)
    private readonly customerLinkRepo: CustomerLinkRepositoryPort,
  ) {
    this.baseUrl = this.config.get<string>('V2_API_URL', 'http://localhost:8080');
    this.secretKey = this.config.get<string>('V2_SHARED_SECRET', '');
  }

  async findCustomerLinks(userId: string): Promise<CustomerLink[]> {
    const realLinks = await this.customerLinkRepo.findByUserId(userId);
    return realLinks.map((link) => ({
      linkId: link.id,
      customerCode: link.customerCode,
      label: link.customerName,
      serviceAddress: link.serviceAddress,
      meterNumber: link.meterNumber ?? '',
    }));
  }

  /**
   * 2. Ký SHA và gọi HTTP sang V2 để lấy danh sách hóa đơn thật
   */
  async findInvoices(customerCodes: string[]): Promise<Invoice[]> {
    if (!customerCodes.length) return [];

    const timestamp = Date.now().toString();
    const payload = JSON.stringify({ customerCodes });

    // Ký HMAC-SHA256: timestamp + body
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(timestamp)
      .update(payload)
      .digest('hex');

    this.logger.log(`[XIN HÓA ĐƠN V2] Gửi ${customerCodes.length} mã KH | Chữ ký: ${signature}`);

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/invoices/unpaid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-timestamp': timestamp,
          'x-signature': signature,
        },
        body: payload,
        signal: AbortSignal.timeout(5000), // Timeout 5 giây
      });

      if (!response.ok) {
        this.logger.warn(`V2 từ chối trả hóa đơn với HTTP status: ${response.status}`);
        return [];
      }

      const res = (await response.json()) as any;
      return (res.data || []) as Invoice[];
    } catch (error) {
      this.logger.error('Lỗi khi gọi V2 lấy hóa đơn:', error);
      return [];
    }
  }
}

