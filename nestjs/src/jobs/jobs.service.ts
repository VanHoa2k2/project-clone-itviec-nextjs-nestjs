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

interface PDFExtractOptions {
  firstPage?: number; // default:`1` - start extract at page nr
  lastPage?: number; //  stop extract at page nr, no default value
  password?: string; //  for decrypting password-protected PDFs., no default value
  verbosity?: number; // default:`-1` - log level of pdf.js
  normalizeWhitespace?: boolean; // default:`false` - replaces all occurrences of whitespace with standard spaces (0x20).
  disableCombineTextItems?: boolean; // default:`false` - do not attempt to combine  same line {@link TextItem}'s.
}

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
    console.log(job);
    const result = await this.jobRepository.save(job);
    console.log(result);
    return result;
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
      const currentDate = new Date();
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

      const resultFilter = result.filter((job) => {
        return job?.endDate.getTime() - currentDate.getTime() > 0;
      });
      // function countWordInDoc(text, keyword) {
      //   // Sử dụng biểu thức chính quy để tìm tất cả các trùng khớp của từ khóa trong văn bản
      //   const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
      //   const matches = text.match(regex);

      //   // Nếu không có trùng khớp nào, trả về 0
      //   if (!matches) {
      //     return 0;
      //   }

      //   // Trả về số lần từ khóa được tìm thấy
      //   return matches.length;
      // }

      // const tfIdf = (doc, skill) => {
      //   const totalWords = doc.length; // Tổng sồ từ trong cv (doc)

      //   // const totalSkillInDoc =

      //   const wordInDoc = countWordInDoc(doc, skill); // Số lần skill (từ) xuất hiện trong cv (doc)

      //   const TF = wordInDoc / totalWords; // Tần suất xuất hiện
      //   console.log(skill, wordInDoc, TF);
      //   // console.log(totalWords);
      //   // console.log(skill);
      // };

      const publicDir = join(__dirname, '..', '..', 'public');
      const url = join(publicDir, 'images', 'resume', filename);

      const pdfExtract = new PDFExtract();
      const options: PDFExtractOptions = {}; /* see below */
      const textArr = [];
      const resultFinal = [];

      await new Promise((resolve, reject) => {
        // đọc file pdf
        pdfExtract.extract(url, options, (err, data) => {
          if (err) reject(err);

          data.pages[0].content.map((obj: any) => {
            textArr.push(obj.str); // push từng từ vào mảng textArr
          });
          // console.log(textArr.length);
          const textFile = textArr.join(''); // gộp các từ lại thành văn bản
          const cleanedText = textFile.replace(/[✉•\+\-]/g, ''); // xóa bỏ các ký tự đặc biệt
          const textFileLowerCase = cleanedText.toLocaleLowerCase();
          // console.log(textFileLowerCase.length);

          tfidf.addDocument(textFileLowerCase); // Sử dụng hàm addDocument của thư viện tfidf để thêm đối số là đoạn văn bản

          resultFilter.map((job) => {
            const measures = [];
            // Lọc ra các skill trong 1 job
            job?.skills.map((skill) => {
              const skillNameLowerCase = skill.name.toLocaleLowerCase();
              // tfIdf(textFileLowerCase, skillNameLowerCase);
              // Sử dụng hàm tfidfs của thư viện tfidf để thêm đối số là từ khóa (skill)
              tfidf.tfidfs(skillNameLowerCase, (i, measure) => {
                console.log(skillNameLowerCase, measure);
                // Nhận được kết quả trả về là measure là 1 giá trị vector thể hiện tầm quan trọng của 1 từ khóa (skill) đó trong đoạn văn bản (cv)
                measures.push({ measure }); // push các measure vào 1 mảng
              });
            });
            // console.log(job.name, measures);
            // Tính tổng measure của 1 job
            const totalMeasures = measures.reduce(
              (total, currentValue) => total + currentValue.measure,
              0,
            );
            // console.log(job.name, totalMeasures);
            if (totalMeasures !== 0) {
              resultFinal.push({ ...job, totalMeasures });
            }
          });

          // Sắp xếp job có độ phù hợp với cv theo measure từ cao tới thấp
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
        if (!resultJobsFind) {
          resultJobsFind = [];
        } else {
          resultJobsFind = resultFinal.slice(offset, limit + offset);
        }
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
