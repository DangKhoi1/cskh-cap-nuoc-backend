import { Body, Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SignatureGuard } from '../../../../guard/signatureGuard.js';

@Controller('webhooks/v2')
@UseGuards(SignatureGuard)
@AllowAnonymous()
export class V2WebhookController {
  private readonly logger = new Logger(V2WebhookController.name);

  @Post('payment-callback')
  @HttpCode(200)
  async handlePaymentCallback(
    @Body() data: { invoiceId: string; status: string; paidAt: string },
  ) {
    this.logger.log(`SHA hợp lệ! Nhận callback gạch nợ: ${JSON.stringify(data)}`);
    return { EC: 1, EM: 'Callback processed successfully' };
  }

  @Post('ping')
  @HttpCode(200)
  async ping(@Body() body: any) {
    this.logger.log('SHA hợp lệ! V2 đã kết nối thành công.');
    return { EC: 1, EM: 'Chữ ký SHA hợp lệ.' };
  }
}

