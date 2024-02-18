import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  // IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

class Company {
  @IsNotEmpty()
  id: number;
}

class Role {
  @IsNotEmpty()
  id: number;
}

export class CreateUserDto {
  id: number;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;
}
