import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getDashboardStatistics(): Promise<{
        earnings: {
            totalYear: number;
            totalMonth: number;
            totalToday: number;
            totalWeek: number;
            monthly: any[];
            weekly: any[];
            daily: any[];
        };
        enrollments: {
            totalPending: number;
            statusStats: any;
        };
        payments: {
            totalCancelled: number;
            statusStats: any;
        };
        users: {
            total: number;
            totalStudents: number;
            totalInstructors: number;
        };
        courses: {
            total: number;
            totalActive: number;
            totalCertificates: number;
            averageRating: number;
            topCourses: any[];
        };
        recentActivity: {
            recentEnrollments: any[];
        };
    }>;
    getEarningsReport(startDate: string, endDate: string): Promise<{
        totalEarnings: any;
        totalPayments: number;
        payments: any[];
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
    }>;
    getEnrollmentReport(startDate: string, endDate: string): Promise<{
        totalEnrollments: number;
        completedEnrollments: number;
        activeEnrollments: number;
        completionRate: number;
        enrollments: any[];
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
    }>;
}
