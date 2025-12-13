import { PaymentMethod } from '../entities/enrollment.entity';
export declare class CreateEnrollmentDto {
    amountPaid: number;
    transactionId: string;
    paymentMethod?: PaymentMethod;
    studentId: number;
    courseId: number;
}
export declare class SslCommerzPaymentDto {
    amount?: number;
    transactionId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    courseId: number;
    studentId: number;
}
