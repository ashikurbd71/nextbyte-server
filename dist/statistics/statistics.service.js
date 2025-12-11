"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const enrollment_entity_2 = require("../enrollment/entities/enrollment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const course_entity_1 = require("../course/entities/course.entity");
const review_entity_1 = require("../review/entities/review.entity");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
let StatisticsService = class StatisticsService {
    enrollmentRepository;
    userRepository;
    adminRepository;
    courseRepository;
    reviewRepository;
    certificateRepository;
    constructor(enrollmentRepository, userRepository, adminRepository, courseRepository, reviewRepository, certificateRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.certificateRepository = certificateRepository;
    }
    async getDashboardStatistics() {
        const [totalEarningsYear, totalEarningsMonth, totalEarningsToday, totalEarningsWeek, totalPendingEnrollments, totalCancelledPayments, totalUsers, totalInstructors, totalActiveCourses, totalStudents, totalCourses, totalCertificates, averageRating, monthlyEarnings, weeklyEarnings, dailyEarnings, topCourses, recentEnrollments, paymentStatusStats, enrollmentStatusStats] = await Promise.all([
            this.getTotalEarningsYear(),
            this.getTotalEarningsMonth(),
            this.getTotalEarningsToday(),
            this.getTotalEarningsWeek(),
            this.getTotalPendingEnrollments(),
            this.getTotalCancelledPayments(),
            this.getTotalUsers(),
            this.getTotalInstructors(),
            this.getTotalActiveCourses(),
            this.getTotalStudents(),
            this.getTotalCourses(),
            this.getTotalCertificates(),
            this.getAverageRating(),
            this.getMonthlyEarnings(),
            this.getWeeklyEarnings(),
            this.getDailyEarnings(),
            this.getTopCourses(),
            this.getRecentEnrollments(),
            this.getPaymentStatusStats(),
            this.getEnrollmentStatusStats()
        ]);
        return {
            earnings: {
                totalYear: totalEarningsYear,
                totalMonth: totalEarningsMonth,
                totalToday: totalEarningsToday,
                totalWeek: totalEarningsWeek,
                monthly: monthlyEarnings,
                weekly: weeklyEarnings,
                daily: dailyEarnings
            },
            enrollments: {
                totalPending: totalPendingEnrollments,
                statusStats: enrollmentStatusStats
            },
            payments: {
                totalCancelled: totalCancelledPayments,
                statusStats: paymentStatusStats
            },
            users: {
                total: totalUsers,
                totalStudents: totalStudents,
                totalInstructors: totalInstructors
            },
            courses: {
                total: totalCourses,
                totalActive: totalActiveCourses,
                totalCertificates: totalCertificates,
                averageRating: averageRating,
                topCourses: topCourses
            },
            recentActivity: {
                recentEnrollments: recentEnrollments
            }
        };
    }
    async getTotalEarningsYear() {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfYear })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalEarningsMonth() {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfMonth })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalEarningsToday() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfDay })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalEarningsWeek() {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfWeek })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalPendingEnrollments() {
        return await this.enrollmentRepository.count({
            where: { status: enrollment_entity_2.EnrollmentStatus.PENDING }
        });
    }
    async getTotalCancelledPayments() {
        return await this.enrollmentRepository.count({
            where: { paymentStatus: enrollment_entity_1.PaymentStatus.CANCELLED }
        });
    }
    async getTotalUsers() {
        return await this.userRepository.count({
            where: { isActive: true, isBanned: false }
        });
    }
    async getTotalInstructors() {
        return await this.adminRepository.count({
            where: { isActive: true }
        });
    }
    async getTotalActiveCourses() {
        return await this.courseRepository.count({
            where: { isActive: true }
        });
    }
    async getTotalStudents() {
        return await this.userRepository.count({
            where: { isActive: true, isBanned: false }
        });
    }
    async getTotalCourses() {
        return await this.courseRepository.count();
    }
    async getTotalCertificates() {
        return await this.certificateRepository.count({
            where: { isActive: true }
        });
    }
    async getAverageRating() {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .getRawOne();
        return Math.round((parseFloat(result?.average || '0')) * 10) / 10;
    }
    async getMonthlyEarnings() {
        const currentYear = new Date().getFullYear();
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
            'EXTRACT(MONTH FROM enrollment.paidAt) as month',
            'SUM(enrollment.amountPaid) as total'
        ])
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('EXTRACT(YEAR FROM enrollment.paidAt) = :year', { year: currentYear })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return result.map(item => ({
            month: months[parseInt(item.month) - 1],
            total: parseFloat(item.total || '0')
        }));
    }
    async getWeeklyEarnings() {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
            'EXTRACT(WEEK FROM enrollment.paidAt) as week',
            'SUM(enrollment.amountPaid) as total'
        ])
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfYear })
            .groupBy('week')
            .orderBy('week', 'ASC')
            .limit(12)
            .getRawMany();
        return result.map(item => ({
            week: `Week ${item.week}`,
            total: parseFloat(item.total || '0')
        }));
    }
    async getDailyEarnings() {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
            'DATE(enrollment.paidAt) as date',
            'SUM(enrollment.amountPaid) as total'
        ])
            .where('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfMonth })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        return result.map(item => ({
            date: item.date,
            total: parseFloat(item.total || '0')
        }));
    }
    async getTopCourses() {
        const result = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoin('course.enrollments', 'enrollment')
            .leftJoin('course.reviews', 'review')
            .select([
            'course.id as courseId',
            'course.name as courseName',
            'course.thumbnail as thumbnail',
            'COUNT(DISTINCT enrollment.id) as enrollmentCount',
            'AVG(review.rating) as averageRating',
            'COUNT(DISTINCT review.id) as reviewCount'
        ])
            .groupBy('course.id')
            .orderBy('enrollmentCount', 'DESC')
            .limit(5)
            .getRawMany();
        return result.map(item => ({
            courseId: item.courseId,
            courseName: item.courseName,
            thumbnail: item.thumbnail,
            enrollmentCount: parseInt(item.enrollmentCount),
            averageRating: Math.round((parseFloat(item.averageRating || '0')) * 10) / 10,
            reviewCount: parseInt(item.reviewCount)
        }));
    }
    async getRecentEnrollments() {
        return await this.enrollmentRepository.find({
            relations: ['student', 'course'],
            order: { createdAt: 'DESC' },
            take: 10
        });
    }
    async getPaymentStatusStats() {
        const [completed, pending, failed, cancelled] = await Promise.all([
            this.enrollmentRepository.count({ where: { paymentStatus: enrollment_entity_1.PaymentStatus.SUCCESS } }),
            this.enrollmentRepository.count({ where: { paymentStatus: enrollment_entity_1.PaymentStatus.PENDING } }),
            this.enrollmentRepository.count({ where: { paymentStatus: enrollment_entity_1.PaymentStatus.FAILED } }),
            this.enrollmentRepository.count({ where: { paymentStatus: enrollment_entity_1.PaymentStatus.CANCELLED } })
        ]);
        return {
            completed,
            pending,
            failed,
            cancelled,
            total: completed + pending + failed + cancelled
        };
    }
    async getEnrollmentStatusStats() {
        const [active, completed, pending, cancelled] = await Promise.all([
            this.enrollmentRepository.count({ where: { status: enrollment_entity_2.EnrollmentStatus.ACTIVE } }),
            this.enrollmentRepository.count({ where: { status: enrollment_entity_2.EnrollmentStatus.COMPLETED } }),
            this.enrollmentRepository.count({ where: { status: enrollment_entity_2.EnrollmentStatus.PENDING } }),
            this.enrollmentRepository.count({ where: { status: enrollment_entity_2.EnrollmentStatus.CANCELLED } })
        ]);
        return {
            active,
            completed,
            pending,
            cancelled,
            total: active + completed + pending + cancelled
        };
    }
    async getEarningsReport(startDate, endDate) {
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .leftJoin('enrollment.course', 'course')
            .leftJoin('enrollment.student', 'student')
            .select([
            'enrollment.id as enrollmentId',
            'enrollment.amountPaid as amount',
            'enrollment.paymentStatus as status',
            'enrollment.paidAt as paidAt',
            'enrollment.paymentMethod as paymentMethod',
            'course.name as courseName',
            'student.name as studentName',
            'student.email as studentEmail'
        ])
            .where('enrollment.paidAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('enrollment.paymentStatus = :status', { status: enrollment_entity_1.PaymentStatus.SUCCESS })
            .orderBy('enrollment.paidAt', 'DESC')
            .getRawMany();
        const totalEarnings = result.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        return {
            totalEarnings,
            totalPayments: result.length,
            payments: result,
            dateRange: {
                startDate,
                endDate
            }
        };
    }
    async getEnrollmentReport(startDate, endDate) {
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .leftJoin('enrollment.course', 'course')
            .leftJoin('enrollment.student', 'student')
            .select([
            'enrollment.id as enrollmentId',
            'enrollment.status as status',
            'enrollment.progress as progress',
            'enrollment.enrolledAt as enrolledAt',
            'enrollment.completedAt as completedAt',
            'course.name as courseName',
            'student.name as studentName',
            'student.email as studentEmail'
        ])
            .where('enrollment.enrolledAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('enrollment.enrolledAt', 'DESC')
            .getRawMany();
        const totalEnrollments = result.length;
        const completedEnrollments = result.filter(e => e.status === enrollment_entity_2.EnrollmentStatus.COMPLETED).length;
        const activeEnrollments = result.filter(e => e.status === enrollment_entity_2.EnrollmentStatus.ACTIVE).length;
        return {
            totalEnrollments,
            completedEnrollments,
            activeEnrollments,
            completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
            enrollments: result,
            dateRange: {
                startDate,
                endDate
            }
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_2.Enrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(4, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(5, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map