import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import type {
    V2CustomerPort,
    V2CustomerProfile,
} from '../../application/ports/v2-customer.port.js';

@Injectable()
export class HttpV2CustomerAdapter implements V2CustomerPort {
    private readonly logger = new Logger(HttpV2CustomerAdapter.name);
    private readonly baseUrl = process.env.V2_API_URL || '';
    private readonly secretKey = process.env.V2_SHARED_SECRET || '';

    async verifyAndGetCustomer(
        customerCode: string,
        phoneNumber: string,
    ): Promise<V2CustomerProfile | null> {
        const timestamp = Date.now().toString();
        const payload = JSON.stringify({ customerCode, phoneNumber });

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(timestamp)
            .update(payload)
            .digest('hex');

        this.logger.log(`[Gọi V2] Mã KH: ${customerCode} Timestamp: ${timestamp}`);
        this.logger.log(`[GỌI V2] Chữ ký SHA: ${signature}`);

        try {
            const response = await fetch(`${this.baseUrl}/api/v1/customers/verify-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-timestamp': timestamp,
                    'x-signature': signature,
                },
                body: payload,
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) {
                this.logger.warn(`V2 trả về lỗi: ${response.status}`);
                return null;
            }

            const result = (await response.json()) as any;
            return result.data as V2CustomerProfile;
        } catch (error) {
            this.logger.error('Can not connect to V2', error);
            return null;
        }
    }
}

