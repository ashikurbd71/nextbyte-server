import { Repository } from 'typeorm';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Course } from '../course/entities/course.entity';
import { Review } from '../review/entities/review.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
export declare class StatisticsService {
    private enrollmentRepository;
    private userRepository;
    private adminRepository;
    private courseRepository;
    private reviewRepository;
    private certificateRepository;
    constructor(enrollmentRepository: Repository<Enrollment>, userRepository: Repository<User>, adminRepository: Repository<Admin>, courseRepository: Repository<Course>, reviewRepository: Repository<Review>, certificateRepository: Repository<Certificate>);
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
    private getTotalEarningsYear;
    private getTotalEarningsMonth;
    private getTotalEarningsToday;
    private getTotalEarningsWeek;
    private getTotalPendingEnrollments;
    private getTotalCancelledPayments;
    private getTotalUsers;
    private getTotalInstructors;
    private getTotalActiveCourses;
    private getTotalStudents;
    private getTotalCourses;
    private getTotalCertificates;
    private getAverageRating;
    private getMonthlyEarnings;
    private getWeeklyEarnings;
    private getDailyEarnings;
    private getTopCourses;
    private getRecentEnrollments;
    private getPaymentStatusStats;
    private getEnrollmentStatusStats;
    getEarningsReport(startDate: Date, endDate: Date): Promise<{
        totalEarnings: any;
        totalPayments: number;
        payments: any[];
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
    }>;
    getEnrollmentReport(startDate: Date, endDate: Date): Promise<{
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
