import { NotificationService } from './notification.service';
import { CreateNotificationDto, CreateBulkNotificationDto, CreateCourseNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from './entities/notification.entity';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    findAll(): Promise<import("./entities/notification.entity").Notification[]>;
    findStudentNotifications(studentId: number): Promise<import("./entities/notification.entity").Notification[]>;
    getStudentUnreadCount(studentId: number): Promise<number>;
    findByType(type: NotificationType): Promise<import("./entities/notification.entity").Notification[]>;
    findOne(id: number): Promise<import("./entities/notification.entity").Notification>;
    update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    markAsRead(id: number): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(id: number): Promise<void>;
    remove(id: number): Promise<void>;
    createAssignmentFeedbackNotification(data: {
        studentId: number;
        assignmentTitle: string;
        marks: number;
        feedback: string;
        courseName: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createAssignmentSubmittedNotification(data: {
        studentId: number;
        assignmentTitle: string;
        moduleName: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createCourseEnrollmentNotification(data: {
        studentId: number;
        courseName: string;
        amount: number;
    }): Promise<import("./entities/notification.entity").Notification>;
    createCourseCompletedNotification(data: {
        studentId: number;
        courseName: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createPaymentSuccessNotification(data: {
        studentId: number;
        courseName: string;
        amount: number;
        transactionId: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createPaymentFailedNotification(data: {
        studentId: number;
        courseName: string;
        amount: number;
        reason: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createNewModuleUploadNotification(data: {
        studentId: number;
        moduleName: string;
        courseName: string;
    }): Promise<import("./entities/notification.entity").Notification>;
    createGeneralNotification(data: {
        studentId: number;
        title: string;
        message: string;
        metadata?: any;
    }): Promise<import("./entities/notification.entity").Notification>;
    createNotificationForAllUsers(createBulkNotificationDto: CreateBulkNotificationDto): Promise<{
        success: boolean;
        totalUsers: number;
        emailsSent: number;
        errors: string[];
    }>;
    sendNotificationsToCourseStudents(courseId: number, createCourseNotificationDto: CreateCourseNotificationDto): Promise<{
        success: boolean;
        totalStudents: number;
        emailsSent: number;
        errors: string[];
    }> | {
        success: boolean;
        totalStudents: number;
        emailsSent: number;
        errors: string[];
    };
    sendNotificationToCourseStudent(courseId: number, studentId: number, createCourseNotificationDto: CreateCourseNotificationDto): Promise<{
        success: boolean;
        emailSent: boolean;
        error?: string;
    }> | {
        success: boolean;
        emailSent: boolean;
        error: string;
    };
}
