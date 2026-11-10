import { IsOptional, IsString, Length } from 'class-validator';
import { ListInvoiceDto } from '../../../application/dtos/list-invoice.dto.js';

export class ListInvoicesDto extends ListInvoiceDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  linkId?: string;
}