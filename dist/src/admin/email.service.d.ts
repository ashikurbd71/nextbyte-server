import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(emailOptions: EmailOptions): Promise<void>;
    sendAssignmentResultEmail(to: string, studentName: string, assignmentTitle: string, marks: number, totalMarks: number, feedback: string, courseName: string, moduleName: string): Promise<void>;
    sendPaymentSuccessEmail(to: string, studentName: string, courseName: string, amount: number, transactionId: string, paymentMethod: string): Promise<void>;
    sendEnrollmentWelcomeEmail(to: string, studentName: string, courseName: string, instructorName: string, facebookGroupLink: string, courseDuration: string, coursePrice: number): Promise<void>;
    sendPaymentFailedEmail(to: string, studentName: string, courseName: string, amount: number, reason: string): Promise<void>;
    sendGeneralNotificationEmail(to: string, studentName: string, title: string, message: string, actionUrl?: string, actionText?: string): Promise<void>;
    sendWelcomeEmail(to: string, studentName: string, verificationCode?: string): Promise<void>;
    sendAdminWelcomeEmail(to: string, adminName: string, email: string, password: string, role: string): Promise<void>;
    private getGrade;
    private getGradeColor;
}
