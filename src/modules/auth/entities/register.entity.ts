import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities';
import { AuthEntity } from './auth.entity';

export class RegisterEntity extends AuthEntity {
  @ApiProperty()
  user: UserEntity;
}
