import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
// import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const company = await this.companyRepository.create({
      ...createCompanyDto,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    console.log(company);
    return await this.companyRepository.save(company);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    const regexFilter = {};
    Object.keys(filter).forEach((key) => {
      regexFilter[key] = ILike(`%${filter[key]}%`);
    });

    const [result, totalItems] = await this.companyRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      // relations: ['createdBy', 'updatedBy'],
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException(`not found company with id=${id}`);
    } else {
      return await this.companyRepository.findOne({
        where: { id },
      });
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyRepository.update(
      { id },
      {
        ...updateCompanyDto,
        updatedBy: {
          id: user.id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: number, user: IUser) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('not found company');
    } else {
      await this.companyRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.companyRepository.softDelete(id);
    }
  }
}
