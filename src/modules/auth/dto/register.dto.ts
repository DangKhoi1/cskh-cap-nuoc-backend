import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { LoginDto } from './login.dto.js';

export class RegisterDto extends LoginDto {
  @IsString()
  @Matches(/^\d{6}$/)
  otp: string;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  @IsString()
  @Length(1, 100)
  userName: string;
}
