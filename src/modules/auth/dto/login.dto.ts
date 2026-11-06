import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { normalizePhoneNumber } from '../phone-number.js';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) => normalizePhoneNumber(value))
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message:
      'phoneNumber must be a Vietnamese 10-digit number or an international number starting with +',
  })
  phoneNumber: string;

  @IsString()
  @Length(8, 128)
  password: string;
}
