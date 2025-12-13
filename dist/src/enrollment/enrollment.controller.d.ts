import { Response as ExpressResponse } from 'express';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto, SslCommerzPaymentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    create(createEnrollmentDto: CreateEnrollmentDto): Promise<import("./entities/enrollment.entity").Enrollment>;
    initiatePayment(paymentDto: SslCommerzPaymentDto): Promise<any>;
    handlePaymentSuccess(query: any, res: ExpressResponse): Promise<void>;
    handlePaymentFailure(query: any, res: ExpressResponse): Promise<void>;
    handlePaymentCancel(query: any, res: ExpressResponse): Promise<void>;
    handlePaymentIpn(body: any): Promise<{
        status: string;
        message?: string;
    }>;
    findAll(): Promise<import("./entities/enrollment.entity").Enrollment[]>;
    findByStudentId(studentId: number): Promise<import("./entities/enrollment.entity").Enrollment[]>;
    findPaymentHistoryByStudentId(studentId: number): Promise<import("./entities/enrollment.entity").Enrollment[]>;
    findByCourse(courseId: number): Promise<import("./entities/enrollment.entity").Enrollment[]>;
    getCourseLeaderboard(courseId: number): Promise<any[]>;
    getAssignmentMarksData(courseId: number): Promise<any>;
    getStudentAssignmentMarksData(courseId: number, studentId: number): Promise<any>;
    getPerformanceByStudentId(studentId: number): Promise<any>;
    getEnrollmentStatistics(): Promise<any>;
    getMotivationalMessageByStudentId(studentId: number): Promise<string>;
    findOne(id: number): Promise<import("./entities/enrollment.entity").Enrollment>;
    update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<import("./entities/enrollment.entity").Enrollment>;
    remove(id: number): Promise<void>;
}
