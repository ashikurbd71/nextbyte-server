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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    create(createNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }
    findAll() {
        return this.notificationService.findAll();
    }
    findStudentNotifications(studentId) {
        return this.notificationService.findByUser(studentId);
    }
    getStudentUnreadCount(studentId) {
        return this.notificationService.getUnreadCount(studentId);
    }
    findByType(type) {
        return this.notificationService.findByType(type);
    }
    findOne(id) {
        return this.notificationService.findOne(id);
    }
    update(id, updateNotificationDto) {
        return this.notificationService.update(id, updateNotificationDto);
    }
    markAsRead(id) {
        return this.notificationService.markAsRead(id);
    }
    markAllAsRead(id) {
        return this.notificationService.markAllAsRead(id);
    }
    remove(id) {
        return this.notificationService.remove(id);
    }
    createAssignmentFeedbackNotification(data) {
        return this.notificationService.createAssignmentFeedbackNotification(data.studentId, data.assignmentTitle, data.marks, data.feedback, data.courseName);
    }
    createAssignmentSubmittedNotification(data) {
        return this.notificationService.createAssignmentSubmittedNotification(data.studentId, data.assignmentTitle, data.moduleName);
    }
    createCourseEnrollmentNotification(data) {
        return this.notificationService.createCourseEnrollmentNotification(data.studentId, data.courseName, data.amount);
    }
    createCourseCompletedNotification(data) {
        return this.notificationService.createCourseCompletedNotification(data.studentId, data.courseName);
    }
    createPaymentSuccessNotification(data) {
        return this.notificationService.createPaymentSuccessNotification(data.studentId, data.courseName, data.amount, data.transactionId);
    }
    createPaymentFailedNotification(data) {
        return this.notificationService.createPaymentFailedNotification(data.studentId, data.courseName, data.amount, data.reason);
    }
    createNewModuleUploadNotification(data) {
        return this.notificationService.createNewModuleUploadNotification(data.studentId, data.moduleName, data.courseName);
    }
    createGeneralNotification(data) {
        return this.notificationService.createGeneralNotification(data.studentId, data.title, data.message, data.metadata);
    }
    createNotificationForAllUsers(createBulkNotificationDto) {
        return this.notificationService.createNotificationForAllUsers(createBulkNotificationDto.title, createBulkNotificationDto.message, createBulkNotificationDto.metadata);
    }
    sendNotificationsToCourseStudents(courseId, createCourseNotificationDto) {
        console.log('Raw request body:', createCourseNotificationDto);
        console.log('Received bulk notification data:', {
            courseId,
            title: createCourseNotificationDto.title,
            message: createCourseNotificationDto.message,
            link: createCourseNotificationDto.link,
            description: createCourseNotificationDto.description
        });
        const message = createCourseNotificationDto.message ||
            createCourseNotificationDto.content ||
            createCourseNotificationDto.body ||
            createCourseNotificationDto.text ||
            createCourseNotificationDto.description ||
            'No message provided';
        console.log('Extracted message:', message);
        if (!createCourseNotificationDto.title) {
            return {
                success: false,
                totalStudents: 0,
                emailsSent: 0,
                errors: ['Title is required']
            };
        }
        const metadata = {
            ...createCourseNotificationDto.metadata,
            link: createCourseNotificationDto.link,
            description: createCourseNotificationDto.description,
            originalMessage: createCourseNotificationDto.message
        };
        return this.notificationService.sendNotificationsToCourseStudents(courseId, createCourseNotificationDto.title, message, metadata);
    }
    sendNotificationToCourseStudent(courseId, studentId, createCourseNotificationDto) {
        console.log('Raw request body:', createCourseNotificationDto);
        console.log('Received notification data:', {
            courseId,
            studentId,
            title: createCourseNotificationDto.title,
            message: createCourseNotificationDto.message,
            link: createCourseNotificationDto.link,
            description: createCourseNotificationDto.description
        });
        const message = createCourseNotificationDto.message ||
            createCourseNotificationDto.content ||
            createCourseNotificationDto.body ||
            createCourseNotificationDto.text ||
            createCourseNotificationDto.description ||
            'No message provided';
        console.log('Extracted message:', message);
        if (!createCourseNotificationDto.title) {
            return {
                success: false,
                emailSent: false,
                error: 'Title is required'
            };
        }
        const metadata = {
            ...createCourseNotificationDto.metadata,
            link: createCourseNotificationDto.link,
            description: createCourseNotificationDto.description,
            originalMessage: createCourseNotificationDto.message
        };
        return this.notificationService.sendNotificationToCourseStudent(courseId, studentId, createCourseNotificationDto.title, message, metadata);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findStudentNotifications", null);
__decorate([
    (0, common_1.Get)('student/unread-count/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "getStudentUnreadCount", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('student/:id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('student/mark-all-read/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('assignment-feedback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createAssignmentFeedbackNotification", null);
__decorate([
    (0, common_1.Post)('assignment-submitted'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createAssignmentSubmittedNotification", null);
__decorate([
    (0, common_1.Post)('course-enrollment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createCourseEnrollmentNotification", null);
__decorate([
    (0, common_1.Post)('course-completed'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createCourseCompletedNotification", null);
__decorate([
    (0, common_1.Post)('payment-success'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createPaymentSuccessNotification", null);
__decorate([
    (0, common_1.Post)('payment-failed'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createPaymentFailedNotification", null);
__decorate([
    (0, common_1.Post)('new-module-upload'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createNewModuleUploadNotification", null);
__decorate([
    (0, common_1.Post)('general'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createGeneralNotification", null);
__decorate([
    (0, common_1.Post)('send-to-all-users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateBulkNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createNotificationForAllUsers", null);
__decorate([
    (0, common_1.Post)('send-to-course-students/:courseId'),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_notification_dto_1.CreateCourseNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendNotificationsToCourseStudents", null);
__decorate([
    (0, common_1.Post)('send-to-course-student/:courseId/:studentId'),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_notification_dto_1.CreateCourseNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendNotificationToCourseStudent", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map