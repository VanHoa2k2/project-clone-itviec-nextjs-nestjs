import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  id: number;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Logo không được để trống' })
  logo: string;
}
