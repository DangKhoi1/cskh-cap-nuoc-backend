import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';
import { normalizePhoneNumber } from '../phone-number.js';

export class RequestOtpDto {
  @Transform(({ value }: { value: unknown }) => normalizePhoneNumber(value))
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/)
  phoneNumber: string;
}
