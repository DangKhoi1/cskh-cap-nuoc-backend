import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class UpdateProfileRequestDto {
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
