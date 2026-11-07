import { IsOptional, IsString, Length } from 'class-validator';

export class ListInvoicesDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  linkId?: string;
}
