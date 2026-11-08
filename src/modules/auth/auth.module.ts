import { Module } from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { auth, authDatabase } from './auth.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { BetterAuthClient } from './infrastructure/better-auth.client.js';
import { TELEGRAM_CONTACT_REPOSITORY } from './application/ports/telegram-contact.repository.port.js';
import { TELEGRAM_MESSAGE_SENDER } from './application/ports/telegram-message-sender.port.js';
import { TelegramService } from './application/use-cases/telegram.service.js';
import { TelegramContactEntity } from './infrastructure/persistence/telegram-contact.entity.js';
import { TypeOrmTelegramContactRepository } from './infrastructure/persistence/typeorm-telegram-contact.repository.js';
import { TelegramBotClient } from './infrastructure/telegram/telegram-bot.client.js';
import { TelegramController } from './presentation/controllers/telegram.controller.js';
import { setTelegramService } from './infrastructure/otp-sender.js';

@Module({
  imports: [
    BetterAuthModule.forRoot({ auth }),
    TypeOrmModule.forFeature([TelegramContactEntity]),
  ],
  controllers: [AuthController, TelegramController],
  providers: [
    AuthService,
    BetterAuthClient,
    TelegramBotClient,
    TelegramService,
    {
      provide: TELEGRAM_MESSAGE_SENDER,
      useExisting: TelegramBotClient,
    },
    {
      provide: TELEGRAM_CONTACT_REPOSITORY,
      useClass: TypeOrmTelegramContactRepository,
    },
  ],
  exports: [BetterAuthModule],
})
export class AuthModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly telegramService: TelegramService) {}

  onModuleInit() {
    setTelegramService(this.telegramService);
  }

  async onModuleDestroy() {
    await authDatabase.end();
  }
}
