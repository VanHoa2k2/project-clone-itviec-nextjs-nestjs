import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { History, Resume } from './entities/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, History])],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
