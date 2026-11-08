import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import {
  TelegramService,
  type TelegramContactPayload,
} from '../../application/use-cases/telegram.service.js';

interface TelegramMessage {
  chat: { id: string | number };
  from: { id: number };
  text?: string;
  contact?: TelegramContactPayload;
}

interface TelegramUpdate {
  message?: TelegramMessage;
}

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  @HttpCode(200)
  @AllowAnonymous()
  async handleWebhook(
    @Headers('x-telegram-bot-api-secret-token') secret: string | undefined,
    @Body() update: TelegramUpdate,
  ): Promise<{ ok: true }> {
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (webhookSecret && secret !== webhookSecret) {
      throw new ForbiddenException('Invalid secret token');
    }

    const message = update.message;
    if (!message) return { ok: true };

    if (message.text === '/start') {
      await this.telegramService.handleStart(message.chat.id);
    } else if (message.contact) {
      await this.telegramService.handleContact(
        message.chat.id,
        message.contact,
        message.from.id,
      );
    }

    return { ok: true };
  }
}
