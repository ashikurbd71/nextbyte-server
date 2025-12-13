"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const email_service_1 = require("../admin/email.service");
const user_entity_1 = require("../users/entities/user.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const course_entity_1 = require("../course/entities/course.entity");
let NotificationService = class NotificationService {
    notificationRepository;
    userRepository;
    enrollmentRepository;
    courseRepository;
    emailService;
    constructor(notificationRepository, userRepository, enrollmentRepository, courseRepository, emailService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.emailService = emailService;
    }
    async create(createNotificationDto) {
        const notification = this.notificationRepository.create(createNotificationDto);
        const savedNotification = await this.notificationRepository.save(notification);
        await this.sendNotificationEmail(savedNotification);
        return savedNotification;
    }
    async findAll() {
        return await this.notificationRepository.find({
            relations: ['recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
            relations: ['recipient']
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return notification;
    }
    async findByUser(userId) {
        return await this.notificationRepository.find({
            where: { recipient: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }
    async findByType(type) {
        return await this.notificationRepository.find({
            where: { type },
            relations: ['recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updateNotificationDto) {
        const notification = await this.findOne(id);
        Object.assign(notification, updateNotificationDto);
        return await this.notificationRepository.save(notification);
    }
    async markAsRead(id) {
        const notification = await this.findOne(id);
        notification.status = notification_entity_1.NotificationStatus.READ;
        return await this.notificationRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ recipient: { id: userId }, status: notification_entity_1.NotificationStatus.UNREAD }, { status: notification_entity_1.NotificationStatus.READ });
    }
    async remove(id) {
        const notification = await this.findOne(id);
        await this.notificationRepository.remove(notification);
    }
    async getUnreadCount(userId) {
        return await this.notificationRepository.count({
            where: { recipient: { id: userId }, status: notification_entity_1.NotificationStatus.UNREAD }
        });
    }
    async createAssignmentFeedbackNotification(studentId, assignmentTitle, marks, feedback, courseName) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Assignment Feedback Received',
            message: `Your assignment "${assignmentTitle}" has been reviewed. You received ${marks} marks. ${feedback ? `Feedback: ${feedback}` : ''}`,
            type: notification_entity_1.NotificationType.ASSIGNMENT_FEEDBACK,
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
    async createAssignmentSubmittedNotification(studentId, assignmentTitle, moduleName) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Assignment Submitted Successfully',
            message: `Your assignment "${assignmentTitle}" for module "${moduleName}" has been submitted successfully and is under review.`,
            type: notification_entity_1.NotificationType.ASSIGNMENT_SUBMITTED,
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
    async createCourseEnrollmentNotification(studentId, courseName, amount) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Course Enrollment Successful',
            message: `You have successfully enrolled in "${courseName}" for ${amount} BDT. Welcome to the course!`,
            type: notification_entity_1.NotificationType.COURSE_ENROLLMENT,
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
    async createCourseCompletedNotification(studentId, courseName) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Course Completed!',
            message: `Congratulations! You have successfully completed "${courseName}". Well done!`,
            type: notification_entity_1.NotificationType.COURSE_COMPLETED,
            recipient: user,
            metadata: {
                courseName
            }
        });
        const savedNotification = await this.notificationRepository.save(notification);
        await this.sendNotificationEmail(savedNotification);
        return savedNotification;
    }
    async createCertificateGeneratedNotification(studentId, courseName) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Certificate Generated!',
            message: `Your certificate for "${courseName}" has been automatically generated and is ready for download. Congratulations on your achievement!`,
            type: notification_entity_1.NotificationType.CERTIFICATE_GENERATED,
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
    async createPaymentSuccessNotification(studentId, courseName, amount, transactionId) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Payment Successful',
            message: `Your payment of ${amount} BDT for "${courseName}" has been processed successfully. Transaction ID: ${transactionId}`,
            type: notification_entity_1.NotificationType.PAYMENT_SUCCESS,
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
    async createPaymentFailedNotification(studentId, courseName, amount, reason) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'Payment Failed',
            message: `Your payment of ${amount} BDT for "${courseName}" has failed. Reason: ${reason}. Please try again.`,
            type: notification_entity_1.NotificationType.PAYMENT_FAILED,
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
    async createNewModuleUploadNotification(studentId, moduleName, courseName) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title: 'New Module Available',
            message: `A new module "${moduleName}" has been added to "${courseName}". Check it out!`,
            type: notification_entity_1.NotificationType.GENERAL,
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
    async createGeneralNotification(studentId, title, message, metadata) {
        const user = await this.userRepository.findOne({ where: { id: studentId } });
        if (!user) {
            throw new Error(`User with ID ${studentId} not found`);
        }
        const notification = this.notificationRepository.create({
            title,
            message,
            type: notification_entity_1.NotificationType.GENERAL,
            recipient: user,
            metadata
        });
        const savedNotification = await this.notificationRepository.save(notification);
        await this.sendNotificationEmail(savedNotification);
        return savedNotification;
    }
    async createNotificationForAllUsers(title, message, metadata) {
        try {
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
            const errors = [];
            let emailsSent = 0;
            for (const user of allUsers) {
                try {
                    const notification = this.notificationRepository.create({
                        title,
                        message,
                        type: notification_entity_1.NotificationType.GENERAL,
                        recipient: user,
                        metadata
                    });
                    const savedNotification = await this.notificationRepository.save(notification);
                    await this.sendNotificationEmail(savedNotification);
                    emailsSent++;
                }
                catch (error) {
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
        }
        catch (error) {
            console.error('Failed to create notifications for all users:', error);
            return {
                success: false,
                totalUsers: 0,
                emailsSent: 0,
                errors: [error.message]
            };
        }
    }
    async sendNotificationsToCourseStudents(courseId, title, message, metadata) {
        try {
            if (!title || !message) {
                return {
                    success: false,
                    totalStudents: 0,
                    emailsSent: 0,
                    errors: ['Title and message are required']
                };
            }
            const course = await this.courseRepository.findOne({ where: { id: courseId } });
            if (!course) {
                return {
                    success: false,
                    totalStudents: 0,
                    emailsSent: 0,
                    errors: ['Course not found']
                };
            }
            const enrollments = await this.enrollmentRepository.find({
                where: {
                    course: { id: courseId },
                    status: enrollment_entity_1.EnrollmentStatus.ACTIVE
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
            const errors = [];
            let emailsSent = 0;
            for (const enrollment of enrollments) {
                const student = enrollment.student;
                if (!student) {
                    const errorMsg = `Student not found for enrollment ID: ${enrollment.id}`;
                    errors.push(errorMsg);
                    console.error(errorMsg);
                    continue;
                }
                try {
                    const notificationMessage = message || 'No message provided';
                    const notification = this.notificationRepository.create({
                        title: title || 'Course Notification',
                        message: notificationMessage,
                        type: notification_entity_1.NotificationType.GENERAL,
                        recipient: student,
                        metadata: {
                            ...metadata,
                            courseId,
                            courseName: course.name,
                            enrollmentId: enrollment.id
                        }
                    });
                    const savedNotification = await this.notificationRepository.save(notification);
                    await this.sendNotificationEmail(savedNotification);
                    emailsSent++;
                }
                catch (error) {
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
        }
        catch (error) {
            console.error('Failed to send notifications to course students:', error);
            return {
                success: false,
                totalStudents: 0,
                emailsSent: 0,
                errors: [error.message]
            };
        }
    }
    async sendNotificationToCourseStudent(courseId, studentId, title, message, metadata) {
        try {
            if (!title || !message) {
                return {
                    success: false,
                    emailSent: false,
                    error: 'Title and message are required'
                };
            }
            const course = await this.courseRepository.findOne({ where: { id: courseId } });
            if (!course) {
                return {
                    success: false,
                    emailSent: false,
                    error: 'Course not found'
                };
            }
            const enrollment = await this.enrollmentRepository.findOne({
                where: {
                    course: { id: courseId },
                    student: { id: studentId },
                    status: enrollment_entity_1.EnrollmentStatus.ACTIVE
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
                const notificationMessage = message || 'No message provided';
                const notification = this.notificationRepository.create({
                    title: title || 'Course Notification',
                    message: notificationMessage,
                    type: notification_entity_1.NotificationType.GENERAL,
                    recipient: student,
                    metadata: {
                        ...metadata,
                        courseId,
                        courseName: course.name,
                        enrollmentId: enrollment.id
                    }
                });
                const savedNotification = await this.notificationRepository.save(notification);
                await this.sendNotificationEmail(savedNotification);
                return {
                    success: true,
                    emailSent: true
                };
            }
            catch (error) {
                const errorMsg = `Failed to send notification to student ${student.id} (${student.email}): ${error.message}`;
                console.error(errorMsg);
                return {
                    success: false,
                    emailSent: false,
                    error: errorMsg
                };
            }
        }
        catch (error) {
            console.error('Failed to send notification to course student:', error);
            return {
                success: false,
                emailSent: false,
                error: error.message
            };
        }
    }
    async sendNotificationEmail(notification) {
        try {
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
        }
        catch (error) {
            console.error('Failed to send notification email:', error);
        }
    }
    generateEmailHTML(notification) {
        let additionalContent = '';
        if (notification.metadata?.description) {
            additionalContent += `<p style="color: #555; line-height: 1.6; margin: 15px 0;"><strong>Description:</strong> ${notification.metadata.description}</p>`;
        }
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
    getEmailActionButton(notification) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        if (notification.metadata?.link) {
            return `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${notification.metadata.link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Details
          </a>
        </div>
      `;
        }
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
            case notification_entity_1.NotificationType.ASSIGNMENT_FEEDBACK:
                return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/assignments" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Assignment
            </a>
          </div>
        `;
            case notification_entity_1.NotificationType.COURSE_ENROLLMENT:
                return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/courses" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Start Learning
            </a>
          </div>
        `;
            case notification_entity_1.NotificationType.CERTIFICATE_GENERATED:
                return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/certificates" style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Certificate
            </a>
          </div>
        `;
            case notification_entity_1.NotificationType.PAYMENT_SUCCESS:
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
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map