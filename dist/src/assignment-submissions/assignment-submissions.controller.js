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
exports.AssignmentSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const assignment_submissions_service_1 = require("./assignment-submissions.service");
const create_assignment_submission_dto_1 = require("./dto/create-assignment-submission.dto");
const update_assignment_submission_dto_1 = require("./dto/update-assignment-submission.dto");
const review_submission_dto_1 = require("./dto/review-submission.dto");
const delete_submission_dto_1 = require("./dto/delete-submission.dto");
let AssignmentSubmissionsController = class AssignmentSubmissionsController {
    assignmentSubmissionsService;
    constructor(assignmentSubmissionsService) {
        this.assignmentSubmissionsService = assignmentSubmissionsService;
    }
    async create(createAssignmentSubmissionDto) {
        return this.assignmentSubmissionsService.create(createAssignmentSubmissionDto);
    }
    async findAll() {
        return this.assignmentSubmissionsService.findAll();
    }
    async findByStudent(studentId) {
        return this.assignmentSubmissionsService.findByStudent(studentId);
    }
    async findByAssignment(assignmentId) {
        return this.assignmentSubmissionsService.findByAssignment(assignmentId);
    }
    async findByUserAndAssignment(userId, assignmentId) {
        return this.assignmentSubmissionsService.findByUserAndAssignment(userId, assignmentId);
    }
    async getStudentPerformance(studentId) {
        return this.assignmentSubmissionsService.getStudentPerformance(studentId);
    }
    async findOne(id) {
        return this.assignmentSubmissionsService.findOne(id);
    }
    async update(id, updateAssignmentSubmissionDto) {
        return this.assignmentSubmissionsService.update(id, updateAssignmentSubmissionDto);
    }
    async reviewSubmission(id, reviewDto) {
        return this.assignmentSubmissionsService.reviewSubmission(id, reviewDto);
    }
    async remove(id, deleteDto) {
        await this.assignmentSubmissionsService.remove(id, deleteDto.studentId);
        return { message: 'Assignment submission deleted successfully' };
    }
};
exports.AssignmentSubmissionsController = AssignmentSubmissionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assignment_submission_dto_1.CreateAssignmentSubmissionDto]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('assignment/:assignmentId'),
    __param(0, (0, common_1.Param)('assignmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findByAssignment", null);
__decorate([
    (0, common_1.Get)('user/:userId/assignment/:assignmentId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('assignmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findByUserAndAssignment", null);
__decorate([
    (0, common_1.Get)('student/:studentId/performance'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "getStudentPerformance", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_assignment_submission_dto_1.UpdateAssignmentSubmissionDto]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('review/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, review_submission_dto_1.ReviewSubmissionDto]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "reviewSubmission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, delete_submission_dto_1.DeleteSubmissionDto]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "remove", null);
exports.AssignmentSubmissionsController = AssignmentSubmissionsController = __decorate([
    (0, common_1.Controller)('assignment-submissions'),
    __metadata("design:paramtypes", [assignment_submissions_service_1.AssignmentSubmissionsService])
], AssignmentSubmissionsController);
//# sourceMappingURL=assignment-submissions.controller.js.map