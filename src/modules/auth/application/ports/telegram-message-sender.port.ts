export const TELEGRAM_MESSAGE_SENDER = Symbol('TELEGRAM_MESSAGE_SENDER');

export interface TelegramMessageSender {
  sendMessage(
    chatId: string | number,
    text: string,
    replyMarkup?: object,
  ): Promise<boolean>;
}
