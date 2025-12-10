import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from '../admin/email.service';
import { User } from '../users/entities/user.entity';
import { Enrollment, EnrollmentStatus } from '../enrollment/entities/enrollment.entity';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private emailService: EmailService,
  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    const savedNotification = await this.notificationRepository.save(notification);

    // Send email notification
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      relations: ['recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['recipient']
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { type },
      relations: ['recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { recipient: { id: userId }, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ }
    );
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { recipient: { id: userId }, status: NotificationStatus.UNREAD }
    });
  }

  // Specific notification creation methods
  async createAssignmentFeedbackNotification(
    studentId: number,
    assignmentTitle: string,
    marks: number,
    feedback: string,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Assignment Feedback Received',
      message: `Your assignment "${assignmentTitle}" has been reviewed. You received ${marks} marks. ${feedback ? `Feedback: ${feedback}` : ''}`,
      type: NotificationType.ASSIGNMENT_FEEDBACK,
      recipient: user,
      metadata: {
        assignmentTitle,
        marks,
        feedback,
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createAssignmentSubmittedNotification(
    studentId: number,
    assignmentTitle: string,
    moduleName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Assignment Submitted Successfully',
      message: `Your assignment "${assignmentTitle}" for module "${moduleName}" has been submitted successfully and is under review.`,
      type: NotificationType.ASSIGNMENT_SUBMITTED,
      recipient: user,
      metadata: {
        assignmentTitle,
        moduleName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCourseEnrollmentNotification(
    studentId: number,
    courseName: string,
    amount: number
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Course Enrollment Successful',
      message: `You have successfully enrolled in "${courseName}" for ${amount} BDT. Welcome to the course!`,
      type: NotificationType.COURSE_ENROLLMENT,
      recipient: user,
      metadata: {
        courseName,
        amount
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCourseCompletedNotification(
    studentId: number,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Course Completed!',
      message: `Congratulations! You have successfully completed "${courseName}". Well done!`,
      type: NotificationType.COURSE_COMPLETED,
      recipient: user,
      metadata: {
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCertificateGeneratedNotification(
    studentId: number,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Certificate Generated!',
      message: `Your certificate for "${courseName}" has been automatically generated and is ready for download. Congratulations on your achievement!`,
      type: NotificationType.CERTIFICATE_GENERATED,
      recipient: user,
      metadata: {
        courseName,
        certificateGenerated: true
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createPaymentSuccessNotification(
    studentId: number,
    courseName: string,
    amount: number,
    transactionId: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Payment Successful',
      message: `Your payment of ${amount} BDT for "${courseName}" has been processed successfully. Transaction ID: ${transactionId}`,
      type: NotificationType.PAYMENT_SUCCESS,
      recipient: user,
      metadata: {
        courseName,
        amount,
        transactionId
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createPaymentFailedNotification(
    studentId: number,
    courseName: string,
    amount: number,
    reason: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Payment Failed',
      message: `Your payment of ${amount} BDT for "${courseName}" has failed. Reason: ${reason}. Please try again.`,
      type: NotificationType.PAYMENT_FAILED,
      recipient: user,
      metadata: {
        courseName,
        amount,
        reason
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createNewModuleUploadNotification(
    studentId: number,
    moduleName: string,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'New Module Available',
      message: `A new module "${moduleName}" has been added to "${courseName}". Check it out!`,
      type: NotificationType.GENERAL,
      recipient: user,
      metadata: {
        moduleName,
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createGeneralNotification(
    studentId: number,
    title: string,
    message: string,
    metadata?: any
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title,
      message,
      type: NotificationType.GENERAL,
      recipient: user,
      metadata
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  // New method to send notification to all users
  async createNotificationForAllUsers(
    title: string,
    message: string,
    metadata?: any
  ): Promise<{ success: boolean; totalUsers: number; emailsSent: number; errors: string[] }> {
    try {
      // Get all active users
      const allUsers = await this.userRepository.find({
        where: { isActive: true },
        select: ['id', 'email', 'name']
      });

      if (allUsers.length === 0) {
        return {
          success: false,
          totalUsers: 0,
          emailsSent: 0,
          errors: ['No active users found']
        };
      }

      const errors: string[] = [];
      let emailsSent = 0;

      // Create notifications and send emails for each user
      for (const user of allUsers) {
        try {
          const notification = this.notificationRepository.create({
            title,
            message,
            type: NotificationType.GENERAL,
            recipient: user,
            metadata
          });

          const savedNotification = await this.notificationRepository.save(notification);

          // Send email notification
          await this.sendNotificationEmail(savedNotification);
          emailsSent++;
        } catch (error) {
          const errorMsg = `Failed to send notification to user ${user.id} (${user.email}): ${error.message}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      return {
        success: emailsSent > 0,
        totalUsers: allUsers.length,
        emailsSent,
        errors
      };
    } catch (error) {
      console.error('Failed to create notifications for all users:', error);
      return {
        success: false,
        totalUsers: 0,
        emailsSent: 0,
        errors: [error.message]
      };
    }
  }

  // New method to send notification to all students enrolled in a specific course
  async sendNotificationsToCourseStudents(
    courseId: number,
    title: string,
    message: string,
    metadata?: any
  ): Promise<{ success: boolean; totalStudents: number; emailsSent: number; errors: string[] }> {
    try {
      // Validate required fields
      if (!title || !message) {
        return {
          success: false,
          totalStudents: 0,
          emailsSent: 0,
          errors: ['Title and message are required']
        };
      }

      // First verify the course exists
      const course = await this.courseRepository.findOne({ where: { id: courseId } });
      if (!course) {
        return {
          success: false,
          totalStudents: 0,
          emailsSent: 0,
          errors: ['Course not found']
        };
      }

      // Get all active students enrolled in the course
      const enrollments = await this.enrollmentRepository.find({
        where: {
          course: { id: courseId },
          status: EnrollmentStatus.ACTIVE // Only active enrollments
        },
        relations: ['student']
      });

      if (enrollments.length === 0) {
        return {
          success: false,
          totalStudents: 0,
          emailsSent: 0,
          errors: ['No active students enrolled in this course']
        };
      }

      const errors: string[] = [];
      let emailsSent = 0;

      // Create notifications and send emails for each student
      for (const enrollment of enrollments) {
        const student = enrollment.student;
        if (!student) {
          const errorMsg = `Student not found for enrollment ID: ${enrollment.id}`;
          errors.push(errorMsg);
          console.error(errorMsg);
          continue;
        }

        try {
          // Ensure message is not null or empty
          const notificationMessage = message || 'No message provided';

          const notification = this.notificationRepository.create({
            title: title || 'Course Notification',
            message: notificationMessage,
            type: NotificationType.GENERAL,
            recipient: student,
            metadata: {
              ...metadata,
              courseId,
              courseName: course.name,
              enrollmentId: enrollment.id
            }
          });

          const savedNotification = await this.notificationRepository.save(notification);

          // Send email notification
          await this.sendNotificationEmail(savedNotification);
          emailsSent++;
        } catch (error) {
          const errorMsg = `Failed to send notification to student ${student.id} (${student.email}): ${error.message}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      return {
        success: emailsSent > 0,
        totalStudents: enrollments.length,
        emailsSent,
        errors
      };
    } catch (error) {
      console.error('Failed to send notifications to course students:', error);
      return {
        success: false,
        totalStudents: 0,
        emailsSent: 0,
        errors: [error.message]
      };
    }
  }

  // New method to send notification to a specific student in a course
  async sendNotificationToCourseStudent(
    courseId: number,
    studentId: number,
    title: string,
    message: string,
    metadata?: any
  ): Promise<{ success: boolean; emailSent: boolean; error?: string }> {
    try {
      // Validate required fields
      if (!title || !message) {
        return {
          success: false,
          emailSent: false,
          error: 'Title and message are required'
        };
      }

      // First verify the course exists
      const course = await this.courseRepository.findOne({ where: { id: courseId } });
      if (!course) {
        return {
          success: false,
          emailSent: false,
          error: 'Course not found'
        };
      }

      // Verify the student exists and is enrolled in the course
      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          course: { id: courseId },
          student: { id: studentId },
          status: EnrollmentStatus.ACTIVE
        },
        relations: ['student']
      });

      if (!enrollment) {
        return {
          success: false,
          emailSent: false,
          error: 'Student not enrolled in this course or enrollment is not active'
        };
      }

      const student = enrollment.student;
      if (!student) {
        return {
          success: false,
          emailSent: false,
          error: 'Student not found'
        };
      }

      try {
        // Ensure message is not null or empty
        const notificationMessage = message || 'No message provided';

        const notification = this.notificationRepository.create({
          title: title || 'Course Notification',
          message: notificationMessage,
          type: NotificationType.GENERAL,
          recipient: student,
          metadata: {
            ...metadata,
            courseId,
            courseName: course.name,
            enrollmentId: enrollment.id
          }
        });

        const savedNotification = await this.notificationRepository.save(notification);

        // Send email notification
        await this.sendNotificationEmail(savedNotification);

        return {
          success: true,
          emailSent: true
        };
      } catch (error) {
        const errorMsg = `Failed to send notification to student ${student.id} (${student.email}): ${error.message}`;
        console.error(errorMsg);
        return {
          success: false,
          emailSent: false,
          error: errorMsg
        };
      }
    } catch (error) {
      console.error('Failed to send notification to course student:', error);
      return {
        success: false,
        emailSent: false,
        error: error.message
      };
    }
  }

  private async sendNotificationEmail(notification: Notification): Promise<void> {
    try {
      // Ensure the recipient relation is loaded
      const notificationWithRecipient = await this.notificationRepository.findOne({
        where: { id: notification.id },
        relations: ['recipient']
      });

      if (!notificationWithRecipient || !notificationWithRecipient.recipient) {
        console.error('Notification or recipient not found for email sending');
        return;
      }

      const emailHTML = this.generateEmailHTML(notificationWithRecipient);
      const actionButton = this.getEmailActionButton(notificationWithRecipient);

      await this.emailService.sendEmail({
        to: notificationWithRecipient.recipient.email,
        subject: notificationWithRecipient.title,
        html: emailHTML + actionButton
      });

      notification.isEmailSent = true;
      notification.emailSentAt = new Date();
      await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }

  private generateEmailHTML(notification: Notification): string {
    let additionalContent = '';

    // Add description if available
    if (notification.metadata?.description) {
      additionalContent += `<p style="color: #555; line-height: 1.6; margin: 15px 0;"><strong>Description:</strong> ${notification.metadata.description}</p>`;
    }

    // Add link if available
    if (notification.metadata?.link) {
      additionalContent += `<p style="color: #555; line-height: 1.6; margin: 15px 0;"><strong>Link:</strong> <a href="${notification.metadata.link}" style="color: #007bff;">${notification.metadata.link}</a></p>`;
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${notification.title}</h2>
        <p style="color: #666; line-height: 1.6;">${notification.message}</p>
        ${additionalContent}
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from NextByte Learning Platform.
        </p>
      </div>
    `;
  }

  private getEmailActionButton(notification: Notification): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Check if it's a course notification with a specific link
    if (notification.metadata?.link) {
      return `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${notification.metadata.link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Details
          </a>
        </div>
      `;
    }

    // Check if it's a course notification
    if (notification.metadata?.courseId) {
      return `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${baseUrl}/courses/${notification.metadata.courseId}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Course
          </a>
        </div>
      `;
    }

    switch (notification.type) {
      case NotificationType.ASSIGNMENT_FEEDBACK:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/assignments" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Assignment
            </a>
          </div>
        `;
      case NotificationType.COURSE_ENROLLMENT:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/courses" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Start Learning
            </a>
          </div>
        `;
      case NotificationType.CERTIFICATE_GENERATED:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/certificates" style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Certificate
            </a>
          </div>
        `;
      case NotificationType.PAYMENT_SUCCESS:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/dashboard" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Go to Dashboard
            </a>
          </div>
        `;
      default:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/notifications" style="background-color: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View All Notifications
            </a>
          </div>
        `;
    }
  }
}
