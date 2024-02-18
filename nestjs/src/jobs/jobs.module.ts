import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job, Skill } from './entities/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Skill])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
