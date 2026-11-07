import { APIError } from 'better-auth/api';

export const otpSender = {
  async send(_data: { phoneNumber: string; code: string }): Promise<void> {
    // Nối Telegram tại đây. Chỉ gửi đến chat đã xác minh thuộc số điện thoại này.
    // Không log OTP và không trả OTP về frontend.
    throw new APIError('SERVICE_UNAVAILABLE', {
      message: 'OTP delivery is not configured',
    });
  },
};
