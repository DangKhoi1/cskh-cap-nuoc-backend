import { Injectable, Logger } from '@nestjs/common';
import type { TelegramMessageSender } from '../../application/ports/telegram-message-sender.port.js';

@Injectable()
export class TelegramBotClient implements TelegramMessageSender {
  private readonly logger = new Logger(TelegramBotClient.name);

  async sendMessage(
    chatId: string | number,
    text: string,
    replyMarkup?: object,
  ): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not configured in environment');
      return false;
    }

    this.logger.log(`Calling Telegram sendMessage API for chatId: ${chatId}`);

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            reply_markup: replyMarkup,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.ok) {
        this.logger.error(
          `Telegram API error for chatId ${chatId}: ${data.description ?? response.statusText}`,
        );
        return false;
      }

      this.logger.log(`Telegram API call succeeded for chatId: ${chatId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to connect to Telegram API for chatId ${chatId}`,
        error,
      );
      return false;
    }
  }
}
