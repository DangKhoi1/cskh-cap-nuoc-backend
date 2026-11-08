export const TELEGRAM_CONTACT_REPOSITORY = Symbol(
  'TELEGRAM_CONTACT_REPOSITORY',
);

export interface TelegramContact {
  phoneNumber: string;
  telegramUserId: string;
  chatId: string;
}

export interface TelegramContactRepository {
  save(contact: TelegramContact): Promise<void>;
  findByPhoneNumber(phoneNumber: string): Promise<TelegramContact | null>;
}
