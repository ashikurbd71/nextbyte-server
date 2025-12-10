import { Controller, Get, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('statistics')
// @UseGuards(JwtAuthGuard)
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get('dashboard')
    async getDashboardStatistics() {
        return await this.statisticsService.getDashboardStatistics();
    }

    @Get('earnings-report')
    async getEarningsReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        if (!startDate || !endDate) {
            throw new BadRequestException('startDate and endDate are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException('Invalid date format. Please use ISO date format (YYYY-MM-DD)');
        }

        return await this.statisticsService.getEarningsReport(start, end);
    }

    @Get('enrollment-report')
    async getEnrollmentReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        if (!startDate || !endDate) {
            throw new BadRequestException('startDate and endDate are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException('Invalid date format. Please use ISO date format (YYYY-MM-DD)');
        }

        return await this.statisticsService.getEnrollmentReport(start, end);
    }
}
