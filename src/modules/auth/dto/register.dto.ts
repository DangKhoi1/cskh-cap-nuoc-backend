import { IsString, Length, Matches } from 'class-validator';
import { LoginDto } from './login.dto.js';

export class RegisterDto extends LoginDto {
  @IsString()
  @Length(8, 128)
  confirmPassword: string;

  @IsString()
  @Matches(/^\d{6}$/)
  otp: string;
}
