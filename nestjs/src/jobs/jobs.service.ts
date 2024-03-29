import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Skill } from './entities/job.entity';
import { ILike, Repository } from 'typeorm';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
const PDFExtract = require('pdf.js-extract').PDFExtract;
import TfIdf from 'node-tfidf';
// const TfIdf = require('node-tfidf');
// import { PDFExtract } from 'pdf.js-extract';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private configService: ConfigService,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const skills = createJobDto.skills;
    const skillArr = [];

    const skillPromises = skills.map(async (skill) => {
      const existingSkill = await this.skillRepository.findOne({
        where: { name: skill },
      });

      if (existingSkill) {
        skillArr.push(existingSkill);
      } else {
        const skillSave = await this.skillRepository.create({
          name: skill,
        });

        const result = await this.skillRepository.save(skillSave);
        skillArr.push(result);
      }
    });
    await Promise.all(skillPromises);

    const job = await this.jobRepository.create({
      ...createJobDto,
      company: {
        id: createJobDto.company.id,
      },
      skills: skillArr,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    return await this.jobRepository.save(job);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const regexFilter = {};

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    Object.keys(filter).forEach((key) => {
      if (key === 'company') {
        regexFilter[key] = {
          id: filter[key],
        };
      } else {
        regexFilter[key] =
          key !== 'skills'
            ? ILike(`%${filter[key]}%`)
            : {
                name: ILike(`%${filter.skills}%`),
              };
      }
    });

    const [result, totalItems] = await this.jobRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['skills', 'company'],
    });

    result.map((job) => {
      job.company = {
        id: job.company.id,
        name: job.company.name,
        logo: job.company.logo,
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
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['skills', 'company'],
    });

    const arrNameSkills: string[] = [];
    job.skills.forEach((skill: any) => {
      return arrNameSkills.push(skill.name);
    });

    if (!job) {
      return `not found job`;
    } else {
      return {
        ...job,
        skills: arrNameSkills,
      };
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto, user: IUser) {
    const skills = updateJobDto?.skills;
    const skillArr = [];

    const skillPromises = skills.map(async (skill) => {
      const existingSkill = await this.skillRepository.findOne({
        where: { name: skill },
      });

      if (existingSkill) {
        skillArr.push(existingSkill);
      } else {
        const skillSave = await this.skillRepository.create({
          name: skill,
        });

        const result = await this.skillRepository.save(skillSave);
        skillArr.push(result);
      }
    });
    await Promise.all(skillPromises);

    const job = await this.jobRepository.findOne({ where: { id } });

    if (!job) {
      throw new BadRequestException(`Job with id ${id} not found.`);
    }

    await this.jobRepository.delete(job);
    return await this.jobRepository.save({
      id,
      ...updateJobDto,
      skills: skillArr,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const job = await this.jobRepository.findOne({
      where: { id },
    });

    if (!job) {
      throw new BadRequestException('not found job');
    } else {
      await this.jobRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.jobRepository.softDelete(id);
    }
  }

  async getJobsSuggest(
    currentPage: number,
    limit: number,
    qs: string,
    filename: string,
  ) {
    try {
      const tfidf = new TfIdf();

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

      const [result, totalItems] = await this.jobRepository.findAndCount({
        relations: ['skills', 'company'],
      });

      result.map((job) => {
        job.company = {
          id: job.company.id,
          name: job.company.name,
          logo: job.company.logo,
        } as any;
      });

      const publicDir = join(__dirname, '..', '..', 'public');
      const url = join(publicDir, 'images', 'resume', filename);

      const pdfExtract = new PDFExtract();
      const options = {}; /* see below */
      const textArr = [];
      const resultFinal = [];

      await new Promise((resolve, reject) => {
        pdfExtract.extract(url, options, (err, data) => {
          if (err) reject(err);
          data.pages[0].content.map((obj: any) => {
            textArr.push(obj.str);
          });
          // console.log(textArr);
          const textFile = textArr.join('');
          const textFileLowerCase = textFile.toLocaleLowerCase();
          tfidf.addDocument(textFileLowerCase);

          result.map((job) => {
            const measures = [];
            job?.skills.map((skill) => {
              const skillNameLowerCase = skill.name.toLocaleLowerCase();

              tfidf.tfidfs(skillNameLowerCase, (i, measure) => {
                measures.push({ measure });
              });
            });
            const totalMeasures = measures.reduce(
              (total, currentValue) => total + currentValue.measure,
              0,
            );

            if (totalMeasures !== 0) {
              resultFinal.push({ ...job, totalMeasures });
            }
          });
          resultFinal.sort(function (a, b) {
            return b.totalMeasures - a.totalMeasures;
          });
          resultFinal.forEach((job) => {
            delete job.totalMeasures;
          });
          resolve(resultFinal);
        });
      });
      let resultJobsFind = resultFinal.slice(0, limit);
      if (currentPage > 1) {
        resultJobsFind = resultFinal.slice(offset, limit + offset);
      }
      const totalPages = Math.ceil(resultFinal.length / defaultLimit);

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: resultFinal.length,
        },
        result: resultJobsFind,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
