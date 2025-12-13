import { User } from '../../users/entities/user.entity';
import { Course } from '../../course/entities/course.entity';
export declare enum EnrollmentStatus {
    PENDING = "pending",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    SSLCOMMERZ = "sslcommerz",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash"
}
export declare class Enrollment {
    id: number;
    amountPaid: number;
    transactionId: string;
    status: EnrollmentStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    sslcommerzSessionKey: string;
    sslcommerzTranId: string;
    sslcommerzValId: string;
    sslcommerzBankTranId: string;
    sslcommerzCardType: string;
    sslcommerzCardIssuer: string;
    sslcommerzCardBrand: string;
    sslcommerzError: string;
    sslcommerzResponse: any;
    paidAt: Date;
    failedAt: Date;
    failureReason: string;
    enrolledAt: Date;
    completedAt: Date;
    progress: number;
    student: User;
    course: Course;
    createdAt: Date;
    updatedAt: Date;
}
