import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    ASSIGNMENT_FEEDBACK = "assignment_feedback",
    ASSIGNMENT_SUBMITTED = "assignment_submitted",
    COURSE_ENROLLMENT = "course_enrollment",
    COURSE_COMPLETED = "course_completed",
    CERTIFICATE_GENERATED = "certificate_generated",
    PAYMENT_SUCCESS = "payment_success",
    PAYMENT_FAILED = "payment_failed",
    GENERAL = "general"
}
export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read",
    ARCHIVED = "archived"
}
export declare class Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    status: NotificationStatus;
    metadata: any;
    isEmailSent: boolean;
    emailSentAt: Date;
    recipient: User;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
