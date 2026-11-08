import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  TELEGRAM_CONTACT_REPOSITORY,
  type TelegramContactRepository,
} from '../ports/telegram-contact.repository.port.js';
import {
  TELEGRAM_MESSAGE_SENDER,
  type TelegramMessageSender,
} from '../ports/telegram-message-sender.port.js';

export interface TelegramContactPayload {
  phone_number: string;
  user_id?: number;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @Inject(TELEGRAM_CONTACT_REPOSITORY)
    private readonly contactRepository: TelegramContactRepository,
    @Inject(TELEGRAM_MESSAGE_SENDER)
    private readonly messageSender: TelegramMessageSender,
  ) {}

  async handleStart(chatId: string | number): Promise<void> {
    await this.messageSender.sendMessage(
      chatId,
      'Vui lòng chia sẻ số điện thoại để nhận mã xác thực OTP.',
      {
        keyboard: [[{ text: 'Chia sẻ số điện thoại', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    );
  }

  async handleContact(
    chatId: string | number,
    contact: TelegramContactPayload,
    senderId: number,
  ): Promise<void> {
    if (contact.user_id && contact.user_id !== senderId) {
      await this.messageSender.sendMessage(
        chatId,
        'Bạn phải chia sẻ số điện thoại của chính tài khoản Telegram này.',
      );
      return;
    }

    const phoneNumber = contact.phone_number.startsWith('+')
      ? contact.phone_number
      : `+${contact.phone_number}`;

    await this.contactRepository.save({
      phoneNumber,
      telegramUserId: String(senderId),
      chatId: String(chatId),
    });

    await this.messageSender.sendMessage(
      chatId,
      `Xác nhận số điện thoại (${phoneNumber}) thành công.`,
      { remove_keyboard: true },
    );
  }

  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    const contact = await this.contactRepository.findByPhoneNumber(phoneNumber);

    if (!contact) {
      throw new BadRequestException(
        'Số điện thoại chưa được liên kết với Telegram Bot.',
      );
    }

    const sent = await this.messageSender.sendMessage(
      contact.chatId,
      `Mã xác thực OTP của bạn là: ${code}. Mã có hiệu lực trong 5 phút.`,
    );

    if (!sent) {
      this.logger.error(`Failed to send OTP to chatId: ${contact.chatId}`);
      throw new Error('Gửi mã OTP thất bại.');
    }
  }
}
