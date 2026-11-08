import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  TelegramContact,
  TelegramContactRepository,
} from '../../application/ports/telegram-contact.repository.port.js';
import { TelegramContactEntity } from './telegram-contact.entity.js';

@Injectable()
export class TypeOrmTelegramContactRepository implements TelegramContactRepository {
  constructor(
    @InjectRepository(TelegramContactEntity)
    private readonly repository: Repository<TelegramContactEntity>,
  ) {}

  async save(contact: TelegramContact): Promise<void> {
    await this.repository.delete({ telegramUserId: contact.telegramUserId });
    await this.repository.save(contact);
  }

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<TelegramContact | null> {
    const entity = await this.repository.findOneBy({ phoneNumber });
    if (!entity) return null;

    return {
      phoneNumber: entity.phoneNumber,
      telegramUserId: entity.telegramUserId,
      chatId: entity.chatId,
    };
  }
}
