import { Injectable, Logger } from '@nestjs/common';
import type {
  V2CustomerPort,
  V2CustomerProfile,
} from '../../application/ports/v2-customer.port.js';

function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '').replace(/^84/, '0');
}

@Injectable()
export class MockV2CustomerAdapter implements V2CustomerPort {
  private readonly logger = new Logger(MockV2CustomerAdapter.name);

  private readonly mockV2Database = [
    {
      customerCode: '01030001',
      phoneNumber: '0945744417',
      customerName: 'Nguyễn Văn An',
      serviceAddress: '12 Nguyễn Trãi, Phường 1',
      meterNumber: 'DH001',
    },
    {
      customerCode: '01030002',
      phoneNumber: '0945744417',
      customerName: 'Nguyễn Văn An (Nhà 2)',
      serviceAddress: '35 Lê Lợi, Phường 2',
      meterNumber: 'DH002',
    },
  ];

  async verifyAndGetCustomer(
    customerCode: string,
    phoneNumber: string,
  ): Promise<V2CustomerProfile | null> {
    const normInputPhone = normalizePhone(phoneNumber);
    this.logger.log(
      `[MockV2] Nhận yêu cầu: Mã KH = "${customerCode}" | SĐT gốc = "${phoneNumber}" | SĐT chuẩn hóa = "${normInputPhone}"`,
    );

    const found = this.mockV2Database.find(
      (item) =>
        item.customerCode === customerCode &&
        normalizePhone(item.phoneNumber) === normInputPhone,
    );

    if (!found) {
      this.logger.warn(
        `[MockV2] Không khớp: Trong CSDL mock chỉ có SĐT "0945744417" cho mã "01030001"`,
      );
      return null;
    }

    this.logger.log(
      `[MockV2] Khớp thành công: ${found.customerName} - ${found.serviceAddress}`,
    );

    return {
      customerCode: found.customerCode,
      customerName: found.customerName,
      serviceAddress: found.serviceAddress,
      meterNumber: found.meterNumber,
    };
  }
}
