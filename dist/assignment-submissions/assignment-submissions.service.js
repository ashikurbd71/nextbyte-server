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
exports.AssignmentSubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_submission_entity_1 = require("./entities/assignment-submission.entity");
const user_entity_1 = require("../users/entities/user.entity");
const assignment_entity_1 = require("../assignment/entities/assignment.entity");
const notification_service_1 = require("../notification/notification.service");
let AssignmentSubmissionsService = class AssignmentSubmissionsService {
    assignmentSubmissionRepository;
    userRepository;
    assignmentRepository;
    notificationService;
    constructor(assignmentSubmissionRepository, userRepository, assignmentRepository, notificationService) {
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationService = notificationService;
    }
    async create(createAssignmentSubmissionDto) {
        const studentId = createAssignmentSubmissionDto.studentId;
        const user = await this.findUserById(studentId);
        const assignment = await this.findAssignmentById(createAssignmentSubmissionDto.assignmentId);
        const submission = this.assignmentSubmissionRepository.create({
            ...createAssignmentSubmissionDto,
            studentId: studentId,
            assignmentId: createAssignmentSubmissionDto.assignmentId,
        });
        const savedSubmission = await this.assignmentSubmissionRepository.save(submission);
        await this.notificationService.createAssignmentSubmittedNotification(studentId, savedSubmission.assignmentTitle, savedSubmission.moduleTitle);
        return savedSubmission;
    }
    async findAll() {
        return await this.assignmentSubmissionRepository.find({
            relations: ['student', 'assignment'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const submission = await this.assignmentSubmissionRepository.findOne({
            where: { id },
            relations: ['student', 'assignment']
        });
        if (!submission) {
            throw new common_1.NotFoundException(`Assignment submission with ID ${id} not found`);
        }
        return submission;
    }
    async findByStudent(studentId) {
        return await this.assignmentSubmissionRepository.find({
            where: { studentId },
            relations: ['assignment'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByAssignment(assignmentId) {
        return await this.assignmentSubmissionRepository.find({
            where: { assignmentId },
            relations: ['student'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByUserAndAssignment(userId, assignmentId) {
        return await this.assignmentSubmissionRepository.findOne({
            where: { studentId: userId, assignmentId },
            relations: ['assignment']
        });
    }
    async update(id, updateAssignmentSubmissionDto) {
        const studentId = updateAssignmentSubmissionDto.studentId;
        const submission = await this.findOne(id);
        if (submission.studentId !== studentId) {
            throw new common_1.ForbiddenException('You can only update your own submissions');
        }
        Object.assign(submission, updateAssignmentSubmissionDto);
        return await this.assignmentSubmissionRepository.save(submission);
    }
    async reviewSubmission(id, reviewDto) {
        const submission = await this.findOne(id);
        submission.marks = reviewDto.marks;
        submission.feedback = reviewDto.feedback || '';
        submission.status = reviewDto.status;
        submission.reviewedAt = new Date();
        const updatedSubmission = await this.assignmentSubmissionRepository.save(submission);
        await this.notificationService.createAssignmentFeedbackNotification(submission.studentId, submission.assignmentTitle, reviewDto.marks, reviewDto.feedback || '', submission.moduleTitle);
        return updatedSubmission;
    }
    async remove(id, userId) {
        const submission = await this.findOne(id);
        if (submission.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own submissions');
        }
        await this.assignmentSubmissionRepository.remove(submission);
    }
    async getStudentPerformance(studentId) {
        const submissions = await this.findByStudent(studentId);
        const totalSubmissions = submissions.length;
        const totalMarks = submissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);
        const averageMarks = totalSubmissions > 0 ? totalMarks / totalSubmissions : 0;
        const statusCounts = {
            pending: submissions.filter(s => s.status === assignment_submission_entity_1.SubmissionStatus.PENDING).length,
            reviewed: submissions.filter(s => s.status === assignment_submission_entity_1.SubmissionStatus.REVIEWED).length,
            approved: submissions.filter(s => s.status === assignment_submission_entity_1.SubmissionStatus.APPROVED).length,
            rejected: submissions.filter(s => s.status === assignment_submission_entity_1.SubmissionStatus.REJECTED).length,
        };
        return {
            totalSubmissions,
            totalMarks,
            averageMarks,
            statusCounts,
            submissions: submissions.map(s => ({
                id: s.id,
                assignmentTitle: s.assignmentTitle,
                marks: s.marks,
                status: s.status,
                submittedAt: s.createdAt
            }))
        };
    }
    async findUserById(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async findAssignmentById(assignmentId) {
        const assignment = await this.assignmentRepository.findOne({
            where: { id: assignmentId },
            relations: ['module']
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${assignmentId} not found`);
        }
        return assignment;
    }
};
exports.AssignmentSubmissionsService = AssignmentSubmissionsService;
exports.AssignmentSubmissionsService = AssignmentSubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_submission_entity_1.AssignmentSubmission)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], AssignmentSubmissionsService);
//# sourceMappingURL=assignment-submissions.service.js.map