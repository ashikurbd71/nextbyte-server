import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from '../admin/email.service';
import { User } from '../users/entities/user.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Course } from '../course/entities/course.entity';
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private enrollmentRepository;
    private courseRepository;
    private emailService;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, enrollmentRepository: Repository<Enrollment>, courseRepository: Repository<Course>, emailService: EmailService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(): Promise<Notification[]>;
    findOne(id: number): Promise<Notification>;
    findByUser(userId: number): Promise<Notification[]>;
    findByType(type: NotificationType): Promise<Notification[]>;
    update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAsRead(id: number): Promise<Notification>;
    markAllAsRead(userId: number): Promise<void>;
    remove(id: number): Promise<void>;
    getUnreadCount(userId: number): Promise<number>;
    createAssignmentFeedbackNotification(studentId: number, assignmentTitle: string, marks: number, feedback: string, courseName: string): Promise<Notification>;
    createAssignmentSubmittedNotification(studentId: number, assignmentTitle: string, moduleName: string): Promise<Notification>;
    createCourseEnrollmentNotification(studentId: number, courseName: string, amount: number): Promise<Notification>;
    createCourseCompletedNotification(studentId: number, courseName: string): Promise<Notification>;
    createCertificateGeneratedNotification(studentId: number, courseName: string): Promise<Notification>;
    createPaymentSuccessNotification(studentId: number, courseName: string, amount: number, transactionId: string): Promise<Notification>;
    createPaymentFailedNotification(studentId: number, courseName: string, amount: number, reason: string): Promise<Notification>;
    createNewModuleUploadNotification(studentId: number, moduleName: string, courseName: string): Promise<Notification>;
    createGeneralNotification(studentId: number, title: string, message: string, metadata?: any): Promise<Notification>;
    createNotificationForAllUsers(title: string, message: string, metadata?: any): Promise<{
        success: boolean;
        totalUsers: number;
        emailsSent: number;
        errors: string[];
    }>;
    sendNotificationsToCourseStudents(courseId: number, title: string, message: string, metadata?: any): Promise<{
        success: boolean;
        totalStudents: number;
        emailsSent: number;
        errors: string[];
    }>;
    sendNotificationToCourseStudent(courseId: number, studentId: number, title: string, message: string, metadata?: any): Promise<{
        success: boolean;
        emailSent: boolean;
        error?: string;
    }>;
    private sendNotificationEmail;
    private generateEmailHTML;
    private getEmailActionButton;
}
