import { IsNotEmpty, IsString } from 'class-validator';

export class LinkCustomerDto {
  @IsString({ message: 'Mã khách hàng phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã khách hàng không được để trống' })
  customerCode: string;
}

