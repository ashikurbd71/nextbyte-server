import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  metadata?: any;

  @IsNumber()
  recipientId: number;

  @IsOptional()
  @IsBoolean()
  isEmailSent?: boolean;
}

export class CreateBulkNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: any;
}

export class CreateCourseNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  metadata?: any;

  // Alternative field names that might be used by clients
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  text?: string;
}
