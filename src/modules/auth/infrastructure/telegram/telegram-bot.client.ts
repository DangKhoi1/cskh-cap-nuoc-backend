import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramBotClient {
  async sendMessage(chatId: string, text: string): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const reponse = await fetch(
      'https://api.telegram.org/bot${token}/sendMessage',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chatId: chatId,
          text,
        }),
      },
    );
    if (!reponse.ok) {
      throw new Error('Unable to send Telegram message');
    }
  }
}
