import { Logger } from '@nestjs/common';
import { APIError } from 'better-auth/api';
import type { TelegramService } from '../application/use-cases/telegram.service.js';

const logger = new Logger('OtpSender');

let telegramServiceInstance: TelegramService | null = null;

export const setTelegramService = (service: TelegramService) => {
  telegramServiceInstance = service;
};

export const otpSender = {
  async send(data: { phoneNumber: string; code: string }): Promise<void> {
    logger.log(
      `Received request to send OTP for phoneNumber: ${data.phoneNumber}`,
    );

    if (!telegramServiceInstance) {
      logger.error('TelegramService instance is not ready');
      throw new APIError('SERVICE_UNAVAILABLE', {
        message: 'Dịch vụ gửi OTP qua Telegram chưa được cấu hình',
      });
    }

    try {
      await telegramServiceInstance.sendOtp(data.phoneNumber, data.code);
    } catch (error: any) {
      logger.error(`Send OTP failed for ${data.phoneNumber}: ${error.message}`);
      throw new APIError('BAD_REQUEST', {
        message: error.message || 'Không thể gửi mã OTP',
      });
    }
  },
};
