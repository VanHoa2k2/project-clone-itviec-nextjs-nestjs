import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCvDto, UploadCvDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, OrderByCondition, Repository } from 'typeorm';
import { History, Resume } from './entities/resume.entity';
import aqp from 'api-query-params';
// import { fromPath } from 'pdf2pic';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async create(CreateUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = CreateUserCvDto;
    const history = await this.historyRepository.create({
      status: 'PENDING',
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });

    const result = await this.historyRepository.save(history);

    const newCV = await this.resumeRepository.create({
      url: url,
      company: {
        id: companyId,
      },
      job: {
        id: jobId,
      },
      email: user.email,
      userId: user.id,
      status: 'PENDING',
      histories: [result],
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    await this.resumeRepository.save(newCV);

    return {
      id: newCV?.id,
      createdAt: newCV?.createdAt,
    };
  }

  async uploadCV(UploadCvDto: UploadCvDto, user: IUser) {
    const { url } = UploadCvDto;

    const newCV = await this.resumeRepository.create({
      url,
      email: user.email,
      userId: user.id,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    await this.resumeRepository.save(newCV);

    return {
      id: newCV?.id,
      createdAt: newCV?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    const regexFilter = {};
    // Object.keys(filter).forEach((key) => {
    //   regexFilter[key] = ILike(`%${filter[key]}%`);
    // });
    Object.keys(filter).forEach((key) => {
      regexFilter[key] =
        key !== 'company'
          ? ILike(`%${filter[key]}%`)
          : {
              name: ILike(`%${filter.company}%`),
            };
    });

    const [result, totalItems] = await this.resumeRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['histories', 'company', 'job'],
    });

    result.map((resume) => {
      resume.company = {
        id: resume.company.id,
        name: resume.company.name,
        logo: resume.company.logo,
      } as any;

      resume.job = {
        id: resume.job.id,
        name: resume.job.name,
      } as any;
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
    const resume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['histories', 'company', 'job'],
    });

    resume.company = {
      id: resume.company.id,
      name: resume.company.name,
    } as any;

    resume.job = {
      id: resume.job.id,
      name: resume.job.name,
    } as any;

    if (!resume) {
      throw new BadRequestException(`not found resume`);
    } else {
      return { resume };
    }
  }

  async update(id: number, status: string, user: IUser) {
    const existingResume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['histories'],
    });

    existingResume.histories.push({
      status,
      updatedAt: new Date(),
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    } as any);

    if (!existingResume) {
      throw new BadRequestException(`Resume with id ${id} not found.`);
    }

    return await this.resumeRepository.save({
      id,
      email: user.email,
      userId: user.id,
      status,
      histories: existingResume.histories,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const job = await this.resumeRepository.findOne({
      where: { id },
    });

    if (!job) {
      throw new BadRequestException('not found company');
    } else {
      await this.resumeRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.resumeRepository.softDelete(id);
    }
  }

  async getCvByUser(user: IUser) {
    const resumes = await this.resumeRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' } as OrderByCondition,
      relations: ['company', 'job'],
    });

    resumes?.map((resume) => {
      resume.company = {
        id: resume?.company?.id,
        name: resume?.company?.name,
        logo: resume?.company?.logo,
      } as any;

      resume.job = {
        id: resume?.job?.id,
        name: resume?.job?.name,
      } as any;
    });

    return resumes;
  }
}
