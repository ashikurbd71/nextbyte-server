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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enrollment_entity_1 = require("./entities/enrollment.entity");
const notification_service_1 = require("../notification/notification.service");
const certificate_service_1 = require("../certificate/certificate.service");
const assignment_submission_entity_1 = require("../assignment-submissions/entities/assignment-submission.entity");
const email_service_1 = require("../admin/email.service");
const user_entity_1 = require("../users/entities/user.entity");
const course_entity_1 = require("../course/entities/course.entity");
const axios_1 = require("axios");
let EnrollmentService = class EnrollmentService {
    enrollmentRepository;
    assignmentSubmissionRepository;
    userRepository;
    courseRepository;
    notificationService;
    certificateService;
    emailService;
    constructor(enrollmentRepository, assignmentSubmissionRepository, userRepository, courseRepository, notificationService, certificateService, emailService) {
        this.enrollmentRepository = enrollmentRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
        this.certificateService = certificateService;
        this.emailService = emailService;
    }
    async create(createEnrollmentDto) {
        const student = await this.userRepository.findOne({
            where: { id: createEnrollmentDto.studentId }
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createEnrollmentDto.studentId} not found`);
        }
        const course = await this.courseRepository.findOne({
            where: { id: createEnrollmentDto.courseId }
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${createEnrollmentDto.courseId} not found`);
        }
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: { student: { id: createEnrollmentDto.studentId }, course: { id: createEnrollmentDto.courseId } }
        });
        if (existingEnrollment) {
            throw new common_1.ForbiddenException('Student is already enrolled in this course');
        }
        const enrollment = this.enrollmentRepository.create({
            ...createEnrollmentDto,
            student: student,
            course: course,
            enrolledAt: new Date(),
            status: enrollment_entity_1.EnrollmentStatus.ACTIVE,
            paymentStatus: enrollment_entity_1.PaymentStatus.SUCCESS,
            paymentMethod: createEnrollmentDto.paymentMethod || enrollment_entity_1.PaymentMethod.SSLCOMMERZ,
            paidAt: new Date()
        });
        const savedEnrollment = await this.enrollmentRepository.save(enrollment);
        const enrollmentWithDetails = await this.enrollmentRepository.findOne({
            where: { id: savedEnrollment.id },
            relations: ['student', 'course', 'course.instructors', 'course.modules', 'course.modules.assignments', 'course.modules.lessons']
        });
        if (!enrollmentWithDetails) {
            throw new common_1.NotFoundException('Enrollment not found after creation');
        }
        await this.notificationService.createCourseEnrollmentNotification(enrollmentWithDetails.student.id, enrollmentWithDetails.course.name, enrollmentWithDetails.amountPaid);
        try {
            await this.emailService.sendEnrollmentWelcomeEmail(enrollmentWithDetails.student.email, enrollmentWithDetails.student.name, enrollmentWithDetails.course.name, enrollmentWithDetails.course.instructors[0]?.name || 'Course Instructor', enrollmentWithDetails.course.facebookGroupLink || '', enrollmentWithDetails.course.duration, enrollmentWithDetails.amountPaid);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error.message);
        }
        return enrollmentWithDetails;
    }
    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TXN_${timestamp}_${random}`;
    }
    async initiateSslCommerzPayment(paymentDto) {
        const student = await this.userRepository.findOne({
            where: { id: paymentDto.studentId }
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${paymentDto.studentId} not found`);
        }
        const course = await this.courseRepository.findOne({
            where: { id: paymentDto.courseId }
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${paymentDto.courseId} not found`);
        }
        const customerName = paymentDto.customerName || student.name || 'Unknown Customer';
        const customerEmail = paymentDto.customerEmail || student.email || '';
        const customerPhone = paymentDto.customerPhone || student.phone || '';
        const customerAddress = paymentDto.customerAddress || student.address || 'N/A';
        const amount = paymentDto.amount || (course.discountPrice || course.price);
        const transactionId = paymentDto.transactionId || this.generateTransactionId();
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: { student: { id: paymentDto.studentId }, course: { id: paymentDto.courseId } }
        });
        if (existingEnrollment) {
            throw new common_1.ForbiddenException('Student is already enrolled in this course');
        }
        const enrollment = this.enrollmentRepository.create({
            amountPaid: amount,
            transactionId: transactionId,
            student: student,
            course: course,
            status: enrollment_entity_1.EnrollmentStatus.PENDING,
            paymentStatus: enrollment_entity_1.PaymentStatus.PENDING,
            paymentMethod: enrollment_entity_1.PaymentMethod.SSLCOMMERZ
        });
        const savedEnrollment = await this.enrollmentRepository.save(enrollment);
        const sslCommerzData = {
            store_id: process.env.SSLCOMMERZ_STORE_ID,
            store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionId,
            product_category: 'education',
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: customerAddress,
            cus_phone: customerPhone,
            ship_name: customerName,
            ship_add1: customerAddress,
            ship_phone: customerPhone,
            value_a: savedEnrollment.id.toString(),
            value_b: paymentDto.courseId.toString(),
            value_c: paymentDto.studentId.toString(),
            success_url: `${process.env.APP_URL}/api/enrollments/payment/success`,
            fail_url: `${process.env.APP_URL}/api/enrollments/payment/fail`,
            cancel_url: `${process.env.APP_URL}/api/enrollments/payment/cancel`,
            ipn_url: `${process.env.APP_URL}/api/enrollments/payment/ipn`,
        };
        try {
            const response = await axios_1.default.post('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', sslCommerzData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.data.status === 'VALID') {
                await this.enrollmentRepository.update(savedEnrollment.id, {
                    sslcommerzSessionKey: response.data.sessionkey
                });
                return {
                    enrollmentId: savedEnrollment.id,
                    sessionKey: response.data.sessionkey,
                    gatewayUrl: response.data.GatewayPageURL,
                    status: 'initiated'
                };
            }
            else {
                throw new Error('SSL Commerz payment initiation failed');
            }
        }
        catch (error) {
            await this.enrollmentRepository.update(savedEnrollment.id, {
                paymentStatus: enrollment_entity_1.PaymentStatus.FAILED,
                failedAt: new Date(),
                failureReason: error.message
            });
            throw new Error(`Payment initiation failed: ${error.message}`);
        }
    }
    async handleSslCommerzSuccess(transactionData) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { transactionId: transactionData.tran_id },
            relations: ['student', 'course', 'course.instructors']
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        await this.enrollmentRepository.update(enrollment.id, {
            paymentStatus: enrollment_entity_1.PaymentStatus.SUCCESS,
            status: enrollment_entity_1.EnrollmentStatus.ACTIVE,
            enrolledAt: new Date(),
            paidAt: new Date(),
            sslcommerzTranId: transactionData.tran_id,
            sslcommerzValId: transactionData.val_id,
            sslcommerzBankTranId: transactionData.bank_tran_id,
            sslcommerzCardType: transactionData.card_type,
            sslcommerzCardIssuer: transactionData.card_issuer,
            sslcommerzCardBrand: transactionData.card_brand,
            sslcommerzResponse: transactionData
        });
        const updatedEnrollment = await this.enrollmentRepository.findOne({
            where: { id: enrollment.id },
            relations: ['student', 'course', 'course.instructors']
        });
        if (!updatedEnrollment) {
            throw new common_1.NotFoundException('Enrollment not found after update');
        }
        await this.notificationService.createCourseEnrollmentNotification(updatedEnrollment.student.id, updatedEnrollment.course.name, updatedEnrollment.amountPaid);
        try {
            await this.emailService.sendEnrollmentWelcomeEmail(updatedEnrollment.student.email, updatedEnrollment.student.name, updatedEnrollment.course.name, updatedEnrollment.course.instructors[0]?.name || 'Course Instructor', updatedEnrollment.course.facebookGroupLink || '', updatedEnrollment.course.duration, updatedEnrollment.amountPaid);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error.message);
        }
        return updatedEnrollment;
    }
    async handleSslCommerzFailure(transactionData) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { transactionId: transactionData.tran_id }
        });
        if (enrollment) {
            await this.enrollmentRepository.update(enrollment.id, {
                paymentStatus: enrollment_entity_1.PaymentStatus.FAILED,
                failedAt: new Date(),
                failureReason: transactionData.error || 'Payment failed',
                sslcommerzError: transactionData.error,
                sslcommerzResponse: transactionData
            });
        }
    }
    async handleSslCommerzIpn(body) {
        try {
            const enrollment = await this.enrollmentRepository.findOne({
                where: { transactionId: body.tran_id }
            });
            if (!enrollment) {
                return { status: 'error', message: 'Enrollment not found' };
            }
            if (body.status === 'VALID') {
                await this.enrollmentRepository.update(enrollment.id, {
                    paymentStatus: enrollment_entity_1.PaymentStatus.SUCCESS,
                    status: enrollment_entity_1.EnrollmentStatus.ACTIVE,
                    enrolledAt: new Date(),
                    paidAt: new Date(),
                    sslcommerzTranId: body.tran_id,
                    sslcommerzValId: body.val_id,
                    sslcommerzBankTranId: body.bank_tran_id,
                    sslcommerzCardType: body.card_type,
                    sslcommerzCardIssuer: body.card_issuer,
                    sslcommerzCardBrand: body.card_brand,
                    sslcommerzResponse: body
                });
            }
            else {
                await this.enrollmentRepository.update(enrollment.id, {
                    paymentStatus: enrollment_entity_1.PaymentStatus.FAILED,
                    failedAt: new Date(),
                    failureReason: body.error || 'Payment failed',
                    sslcommerzError: body.error,
                    sslcommerzResponse: body
                });
            }
            return { status: 'success' };
        }
        catch (error) {
            return { status: 'error', message: error.message };
        }
    }
    async findAll() {
        return await this.enrollmentRepository.find({
            relations: ['student', 'course', 'course.instructors', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
            relations: ['student', 'course', 'course.instructors', 'course.modules', 'course.modules.assignments', 'course.modules.lessons']
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment with ID ${id} not found`);
        }
        return enrollment;
    }
    async findByStudent(studentId) {
        return await this.enrollmentRepository.find({
            where: { student: { id: studentId } },
            relations: ['course', 'course.instructors', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByCourse(courseId) {
        return await this.enrollmentRepository.find({
            where: { course: { id: courseId } },
            relations: ['student', 'course.instructors', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updateEnrollmentDto) {
        const enrollment = await this.findOne(id);
        Object.assign(enrollment, updateEnrollmentDto);
        return await this.enrollmentRepository.save(enrollment);
    }
    async remove(id) {
        const enrollment = await this.findOne(id);
        await this.enrollmentRepository.remove(enrollment);
    }
    async updateProgress(enrollmentId, progress) {
        const enrollment = await this.findOne(enrollmentId);
        const previousProgress = enrollment.progress;
        enrollment.progress = Math.min(100, Math.max(0, progress));
        if (enrollment.progress >= 100 && enrollment.status !== enrollment_entity_1.EnrollmentStatus.COMPLETED) {
            enrollment.status = enrollment_entity_1.EnrollmentStatus.COMPLETED;
            enrollment.completedAt = new Date();
            await this.notificationService.createCourseCompletedNotification(enrollment.student.id, enrollment.course.name);
            try {
                await this.certificateService.generateCertificateForCompletedCourse(enrollmentId);
                await this.notificationService.createCertificateGeneratedNotification(enrollment.student.id, enrollment.course.name);
            }
            catch (error) {
                console.error('Failed to generate certificate automatically:', error.message);
            }
        }
        return await this.enrollmentRepository.save(enrollment);
    }
    async getCourseLeaderboard(courseId) {
        const enrollments = await this.enrollmentRepository.find({
            where: {
                course: { id: courseId }
            },
            relations: ['student'],
        });
        if (!enrollments || enrollments.length === 0) {
            return [];
        }
        const leaderboardData = await Promise.all(enrollments.map(async (enrollment) => {
            if (!enrollment.student) {
                return null;
            }
            const submissions = await this.assignmentSubmissionRepository
                .createQueryBuilder('submission')
                .innerJoin('submission.assignment', 'assignment')
                .innerJoin('assignment.module', 'module')
                .innerJoin('module.course', 'course')
                .where('submission.studentId = :studentId', { studentId: enrollment.student.id })
                .andWhere('course.id = :courseId', { courseId })
                .andWhere('submission.marks IS NOT NULL')
                .getMany();
            const totalMarks = submissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);
            const averageMarks = submissions.length > 0 ? totalMarks / submissions.length : 0;
            const assignmentCount = submissions.length;
            return {
                student: enrollment.student,
                studentName: enrollment.student.name,
                studentId: enrollment.student.id,
                averageMarks: Math.round(averageMarks * 100) / 100,
                assignmentCount,
                totalMarks,
                progress: enrollment.progress || 0,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
                status: enrollment.status
            };
        }));
        const validLeaderboardData = leaderboardData.filter(data => data !== null);
        validLeaderboardData.sort((a, b) => {
            if (b.averageMarks !== a.averageMarks) {
                return b.averageMarks - a.averageMarks;
            }
            return b.assignmentCount - a.assignmentCount;
        });
        return validLeaderboardData.map((data, index) => ({
            rank: index + 1,
            ...data
        }));
    }
    async getAssignmentMarksData(courseId) {
        const submissions = await this.assignmentSubmissionRepository
            .createQueryBuilder('submission')
            .leftJoin('submission.assignment', 'assignment')
            .leftJoin('assignment.module', 'module')
            .leftJoin('module.course', 'course')
            .leftJoin('submission.student', 'student')
            .where('course.id = :courseId', { courseId })
            .andWhere('submission.marks IS NOT NULL')
            .select([
            'submission.marks',
            'assignment.title',
            'assignment.totalMarks',
            'student.name',
            'student.id',
            'assignment.id'
        ])
            .getRawMany();
        const assignmentData = submissions.reduce((acc, submission) => {
            const assignmentId = submission.assignment_id;
            const assignmentTitle = submission.assignment_title;
            const totalMarks = submission.assignment_totalMarks;
            if (!acc[assignmentId]) {
                acc[assignmentId] = {
                    assignmentId,
                    assignmentTitle,
                    totalMarks,
                    submissions: [],
                    averageMarks: 0,
                    highestMarks: 0,
                    lowestMarks: 0,
                    submissionCount: 0
                };
            }
            acc[assignmentId].submissions.push({
                studentId: submission.student_id,
                studentName: submission.student_name,
                marks: submission.submission_marks,
                percentage: Math.round((submission.submission_marks / totalMarks) * 100)
            });
            return acc;
        }, {});
        Object.values(assignmentData).forEach((assignment) => {
            const marks = assignment.submissions.map(s => s.marks);
            assignment.averageMarks = Math.round(marks.reduce((sum, mark) => sum + mark, 0) / marks.length);
            assignment.highestMarks = Math.max(...marks);
            assignment.lowestMarks = Math.min(...marks);
            assignment.submissionCount = marks.length;
        });
        const studentData = submissions.reduce((acc, submission) => {
            const studentId = submission.student_id;
            const studentName = submission.student_name;
            if (!acc[studentId]) {
                acc[studentId] = {
                    studentId,
                    studentName,
                    assignments: [],
                    totalMarks: 0,
                    averageMarks: 0,
                    assignmentCount: 0
                };
            }
            acc[studentId].assignments.push({
                assignmentId: submission.assignment_id,
                assignmentTitle: submission.assignment_title,
                marks: submission.submission_marks,
                totalMarks: submission.assignment_totalMarks,
                percentage: Math.round((submission.submission_marks / submission.assignment_totalMarks) * 100)
            });
            acc[studentId].totalMarks += submission.submission_marks;
            acc[studentId].assignmentCount += 1;
            return acc;
        }, {});
        Object.values(studentData).forEach((student) => {
            student.averageMarks = Math.round(student.totalMarks / student.assignmentCount);
        });
        return {
            courseId,
            assignmentData: Object.values(assignmentData),
            studentData: Object.values(studentData),
            summary: {
                totalAssignments: Object.keys(assignmentData).length,
                totalStudents: Object.keys(studentData).length,
                totalSubmissions: submissions.length,
                overallAverageMarks: Math.round(submissions.reduce((sum, s) => sum + s.submission_marks, 0) / submissions.length)
            }
        };
    }
    async getStudentAssignmentMarksData(studentId, courseId) {
        const submissions = await this.assignmentSubmissionRepository
            .createQueryBuilder('submission')
            .leftJoin('submission.assignment', 'assignment')
            .leftJoin('assignment.module', 'module')
            .leftJoin('module.course', 'course')
            .where('submission.student.id = :studentId', { studentId })
            .andWhere('course.id = :courseId', { courseId })
            .andWhere('submission.marks IS NOT NULL')
            .select([
            'submission.marks',
            'submission.createdAt',
            'assignment.title',
            'assignment.totalMarks',
            'assignment.id'
        ])
            .orderBy('submission.createdAt', 'ASC')
            .getRawMany();
        const assignmentMarks = submissions.map(submission => ({
            assignmentId: submission.assignment_id,
            assignmentTitle: submission.assignment_title,
            marks: submission.submission_marks,
            totalMarks: submission.assignment_totalMarks,
            percentage: Math.round((submission.submission_marks / submission.assignment_totalMarks) * 100),
            submittedAt: submission.submission_createdAt
        }));
        const totalMarks = submissions.reduce((sum, s) => sum + s.submission_marks, 0);
        const averageMarks = submissions.length > 0 ? Math.round(totalMarks / submissions.length) : 0;
        const averagePercentage = submissions.length > 0
            ? Math.round(submissions.reduce((sum, s) => sum + (s.submission_marks / s.assignment_totalMarks) * 100, 0) / submissions.length)
            : 0;
        return {
            studentId,
            courseId,
            assignmentMarks,
            summary: {
                totalAssignments: submissions.length,
                totalMarks,
                averageMarks,
                averagePercentage,
                highestMarks: submissions.length > 0 ? Math.max(...submissions.map(s => s.submission_marks)) : 0,
                lowestMarks: submissions.length > 0 ? Math.min(...submissions.map(s => s.submission_marks)) : 0
            }
        };
    }
    async getStudentPerformance(studentId) {
        const enrollments = await this.findByStudent(studentId);
        const totalEnrollments = enrollments.length;
        const completedCourses = enrollments.filter(e => e.status === enrollment_entity_1.EnrollmentStatus.COMPLETED).length;
        const activeCourses = enrollments.filter(e => e.status === enrollment_entity_1.EnrollmentStatus.ACTIVE).length;
        const averageProgress = enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
            : 0;
        const totalSpent = enrollments.reduce((sum, e) => sum + parseFloat(e.amountPaid.toString()), 0);
        return {
            totalEnrollments,
            completedCourses,
            activeCourses,
            averageProgress: Math.round(averageProgress),
            totalSpent,
            enrollments: enrollments.map(e => ({
                id: e.id,
                courseName: e.course.name,
                progress: e.progress,
                status: e.status,
                enrolledAt: e.enrolledAt,
                completedAt: e.completedAt,
                amountPaid: e.amountPaid
            }))
        };
    }
    async getEnrollmentStatistics() {
        const totalEnrollments = await this.enrollmentRepository.count();
        const activeEnrollments = await this.enrollmentRepository.count({
            where: { status: enrollment_entity_1.EnrollmentStatus.ACTIVE }
        });
        const completedEnrollments = await this.enrollmentRepository.count({
            where: { status: enrollment_entity_1.EnrollmentStatus.COMPLETED }
        });
        const pendingEnrollments = await this.enrollmentRepository.count({
            where: { status: enrollment_entity_1.EnrollmentStatus.PENDING }
        });
        const totalRevenue = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .getRawOne();
        const averageProgress = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('AVG(enrollment.progress)', 'average')
            .getRawOne();
        return {
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            pendingEnrollments,
            totalRevenue: totalRevenue?.total || 0,
            averageProgress: Math.round(averageProgress?.average || 0),
            completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
        };
    }
    async getDynamicMotivationalMessage(studentId) {
        const performance = await this.getStudentPerformance(studentId);
        if (performance.completedCourses === 0) {
            return "🚀 Welcome to your learning journey! Every expert was once a beginner. Start with your first lesson and take it one step at a time.";
        }
        if (performance.averageProgress < 30) {
            return "💪 You're just getting started! Remember, consistency beats perfection. Keep going, and you'll see amazing results.";
        }
        if (performance.averageProgress < 60) {
            return "🔥 You're making great progress! You're halfway there. Keep pushing forward, and you'll reach your goals.";
        }
        if (performance.averageProgress < 90) {
            return "⭐ You're almost there! You've come so far. Just a little more effort and you'll complete this course successfully.";
        }
        if (performance.completedCourses >= 3) {
            return "🏆 You're a learning champion! You've completed multiple courses. Your dedication and hard work are truly inspiring.";
        }
        return "🎉 Congratulations on your progress! You're doing an amazing job. Keep up the excellent work!";
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(assignment_submission_entity_1.AssignmentSubmission)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        certificate_service_1.CertificateService,
        email_service_1.EmailService])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map