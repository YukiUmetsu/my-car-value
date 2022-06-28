import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    create(reportDto: CreateReportDto, user: User): Promise<Report> {
        const rep = this.repo.create(reportDto);
        rep.user = user;
        return this.repo.save(rep);
    }

    async changeApproval(id: string, approved: boolean): Promise<Report> {
        const report = await this.repo.findOneBy({id});
        if (!report) {
            throw new NotFoundException('report not found');
        }
        report.approved = approved;
        return this.repo.save(report);
    }

}
