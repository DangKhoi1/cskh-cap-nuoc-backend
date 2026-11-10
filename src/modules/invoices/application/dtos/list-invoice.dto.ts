import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListInvoiceDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
