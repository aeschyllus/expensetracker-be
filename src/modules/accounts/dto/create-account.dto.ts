import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
