import { NotificationType, NotificationStatus } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    title: string;
    message: string;
    type: NotificationType;
    status?: NotificationStatus;
    metadata?: any;
    recipientId: number;
    isEmailSent?: boolean;
}
export declare class CreateBulkNotificationDto {
    title: string;
    message: string;
    metadata?: any;
}
export declare class CreateCourseNotificationDto {
    title: string;
    message: string;
    link?: string;
    description?: string;
    metadata?: any;
    content?: string;
    body?: string;
    text?: string;
}
