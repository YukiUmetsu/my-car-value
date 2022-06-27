import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto): Promise<Report> {
        return this.reportsService.create(body);
    }
}
