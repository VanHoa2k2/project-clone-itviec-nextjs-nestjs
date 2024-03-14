import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty({ message: 'id không được để trống' })
  id: number;

  @IsNotEmpty({ message: 'Avatar không được để trống' })
  avatar: string;
}
