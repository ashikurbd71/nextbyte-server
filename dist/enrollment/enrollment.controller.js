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
exports.EnrollmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enrollment_service_1 = require("./enrollment.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const update_enrollment_dto_1 = require("./dto/update-enrollment.dto");
let EnrollmentController = class EnrollmentController {
    enrollmentService;
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    create(createEnrollmentDto) {
        return this.enrollmentService.create(createEnrollmentDto);
    }
    initiatePayment(paymentDto) {
        return this.enrollmentService.initiateSslCommerzPayment(paymentDto);
    }
    async handlePaymentSuccess(query, res) {
        const enrollment = await this.enrollmentService.handleSslCommerzSuccess(query);
        res.redirect(`${process.env.FRONTEND_URL}/payment/success?enrollmentId=${enrollment.id}`);
    }
    async handlePaymentFailure(query, res) {
        await this.enrollmentService.handleSslCommerzFailure(query);
        res.redirect(`${process.env.FRONTEND_URL}/payment/failed?transactionId=${query.tran_id}`);
    }
    async handlePaymentCancel(query, res) {
        await this.enrollmentService.handleSslCommerzFailure(query);
        res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled?transactionId=${query.tran_id}`);
    }
    async handlePaymentIpn(body) {
        return this.enrollmentService.handleSslCommerzIpn(body);
    }
    findAll() {
        return this.enrollmentService.findAll();
    }
    findByStudentId(studentId) {
        return this.enrollmentService.findByStudent(studentId);
    }
    findPaymentHistoryByStudentId(studentId) {
        return this.enrollmentService.findByStudent(studentId);
    }
    findByCourse(courseId) {
        return this.enrollmentService.findByCourse(courseId);
    }
    getCourseLeaderboard(courseId) {
        return this.enrollmentService.getCourseLeaderboard(courseId);
    }
    getAssignmentMarksData(courseId) {
        return this.enrollmentService.getAssignmentMarksData(courseId);
    }
    getStudentAssignmentMarksData(courseId, studentId) {
        return this.enrollmentService.getStudentAssignmentMarksData(studentId, courseId);
    }
    getPerformanceByStudentId(studentId) {
        return this.enrollmentService.getStudentPerformance(studentId);
    }
    getEnrollmentStatistics() {
        return this.enrollmentService.getEnrollmentStatistics();
    }
    getMotivationalMessageByStudentId(studentId) {
        return this.enrollmentService.getDynamicMotivationalMessage(studentId);
    }
    findOne(id) {
        return this.enrollmentService.findOne(id);
    }
    update(id, updateEnrollmentDto) {
        return this.enrollmentService.update(id, updateEnrollmentDto);
    }
    remove(id) {
        return this.enrollmentService.remove(id);
    }
};
exports.EnrollmentController = EnrollmentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new enrollment',
        description: 'Create a new enrollment for a student in a course. Payment is assumed to be already processed.'
    }),
    (0, swagger_1.ApiBody)({ type: create_enrollment_dto_1.CreateEnrollmentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Enrollment created successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - student already enrolled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or course not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.CreateEnrollmentDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('payment/initiate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initiate SSL Commerz payment',
        description: 'Initiate a payment through SSL Commerz gateway and create a pending enrollment. Transaction ID, customer details, and amount will be auto-generated/populated if not provided.'
    }),
    (0, swagger_1.ApiBody)({ type: create_enrollment_dto_1.SslCommerzPaymentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Payment initiated successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - student already enrolled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or course not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.SslCommerzPaymentDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Post)('payment/success'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle SSL Commerz success callback',
        description: 'Process successful payment callback from SSL Commerz'
    }),
    (0, swagger_1.ApiQuery)({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' }),
    (0, swagger_1.ApiQuery)({ name: 'val_id', description: 'Validation ID from SSL Commerz' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enrollment not found' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "handlePaymentSuccess", null);
__decorate([
    (0, common_1.Post)('payment/fail'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle SSL Commerz failure callback',
        description: 'Process failed payment callback from SSL Commerz'
    }),
    (0, swagger_1.ApiQuery)({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment failure processed' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "handlePaymentFailure", null);
__decorate([
    (0, common_1.Post)('payment/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle SSL Commerz cancellation callback',
        description: 'Process cancelled payment callback from SSL Commerz'
    }),
    (0, swagger_1.ApiQuery)({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment cancellation processed' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "handlePaymentCancel", null);
__decorate([
    (0, common_1.Post)('payment/ipn'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle SSL Commerz IPN',
        description: 'Process Instant Payment Notification from SSL Commerz (server-to-server)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'IPN processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "handlePaymentIpn", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all enrollments',
        description: 'Retrieve all enrollments (admin only)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all enrollments'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get enrollments by student ID',
        description: 'Retrieve all enrollments for a specific student by their ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of student enrollments'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findByStudentId", null);
__decorate([
    (0, common_1.Get)('student/payment-history/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment history by student ID',
        description: 'Retrieve payment history for a specific student by their ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student payment history'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findPaymentHistoryByStudentId", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get enrollments by course',
        description: 'Retrieve all enrollments for a specific course'
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of course enrollments' }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findByCourse", null);
__decorate([
    (0, common_1.Get)('course/leaderboard/:courseId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get course leaderboard',
        description: 'Retrieve leaderboard data for a specific course based on assignment performance'
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course leaderboard'
    }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getCourseLeaderboard", null);
__decorate([
    (0, common_1.Get)('course/assignment-marks/:courseId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get assignment marks data',
        description: 'Retrieve comprehensive assignment marks data for a course'
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment marks data' }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getAssignmentMarksData", null);
__decorate([
    (0, common_1.Get)('course/:courseId/student/:studentId/assignment-marks'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get student assignment marks',
        description: 'Retrieve assignment marks for a specific student in a course'
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student assignment marks' }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getStudentAssignmentMarksData", null);
__decorate([
    (0, common_1.Get)('performance/student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get performance by student ID',
        description: 'Retrieve performance statistics for a specific student by their ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student performance data'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getPerformanceByStudentId", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get enrollment statistics',
        description: 'Retrieve overall enrollment statistics (admin only)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Enrollment statistics'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getEnrollmentStatistics", null);
__decorate([
    (0, common_1.Get)('motivational-message/student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get motivational message by student ID',
        description: 'Get a personalized motivational message for a specific student based on their performance'
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student motivational message'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getMotivationalMessageByStudentId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get enrollment by ID',
        description: 'Retrieve a specific enrollment by its ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Enrollment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollment details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enrollment not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update enrollment',
        description: 'Update an enrollment by ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Enrollment ID' }),
    (0, swagger_1.ApiBody)({ type: update_enrollment_dto_1.UpdateEnrollmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollment updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enrollment not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_enrollment_dto_1.UpdateEnrollmentDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete enrollment',
        description: 'Delete an enrollment by ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Enrollment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollment deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enrollment not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "remove", null);
exports.EnrollmentController = EnrollmentController = __decorate([
    (0, swagger_1.ApiTags)('Enrollments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentController);
//# sourceMappingURL=enrollment.controller.js.map