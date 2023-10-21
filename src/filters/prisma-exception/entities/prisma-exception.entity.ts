import { ApiProperty } from '@nestjs/swagger';

export class PrismaExceptionEntity {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
