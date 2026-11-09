import { Injectable } from '@nestjs/common';
import type {
    V2CustomerPort,
    V2CustomerProfile,
} from '../../application/ports/v2-customer.port.js';

@Injectable()
export class MockV2CustomerAdapter implements V2CustomerPort {
        private readonly mockV2Database =[
            {
                customerCode: '01030001',
                phoneNumber: '+84945744417',
                customerName: 'Nguyễn Văn An',
                serviceAddress: '12 Nguyễn Trãi, Phường 1',
                meterNumber: 'DH001',
            },
            {
      customerCode: '01030002',
                phoneNumber: '+84945744417',
                customerName: 'Nguyễn Văn An (Nhà 2)',
                serviceAddress: '35 Lê Lợi, Phường 2',
                meterNumber: 'DH002',
            },
  ];

  async verifyAndGetCustomer(
    customerCode: string,
    phoneNumber: string,
): Promise < V2CustomerProfile | null > {
    const found = this.mockV2Database.find(
        (item) =>
            item.customerCode === customerCode && item.phoneNumber === phoneNumber,
    );
    if(!found) return null;
    return {
        customerCode: found.customerCode,
        customerName: found.customerName,
        serviceAddress: found.serviceAddress,
        meterNumber: found.meterNumber,
    };
}
}