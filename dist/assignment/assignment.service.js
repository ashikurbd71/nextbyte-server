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
exports.AssignmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./entities/assignment.entity");
const module_entity_1 = require("../module/entities/module.entity");
let AssignmentService = class AssignmentService {
    assignmentRepository;
    moduleRepository;
    constructor(assignmentRepository, moduleRepository) {
        this.assignmentRepository = assignmentRepository;
        this.moduleRepository = moduleRepository;
    }
    async create(createAssignmentDto) {
        try {
            const module = await this.moduleRepository.findOne({
                where: { id: createAssignmentDto.moduleId }
            });
            if (!module) {
                throw new common_1.NotFoundException(`Module with ID ${createAssignmentDto.moduleId} not found`);
            }
            const assignment = this.assignmentRepository.create({
                ...createAssignmentDto,
                module: module,
                totalMarks: createAssignmentDto.totalMarks || 100,
                isActive: createAssignmentDto.isActive !== undefined ? createAssignmentDto.isActive : true,
            });
            return await this.assignmentRepository.save(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create assignment');
        }
    }
    async findAll() {
        try {
            return await this.assignmentRepository.find({
                relations: ['module'],
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch assignments');
        }
    }
    async findActiveAssignments() {
        try {
            return await this.assignmentRepository.find({
                where: { isActive: true },
                relations: ['module'],
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch active assignments');
        }
    }
    async findOne(id) {
        try {
            const assignment = await this.assignmentRepository.findOne({
                where: { id },
                relations: ['module', 'submissions']
            });
            if (!assignment) {
                throw new common_1.NotFoundException(`Assignment with ID ${id} not found`);
            }
            return assignment;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch assignment');
        }
    }
    async findByModule(moduleId) {
        try {
            const assignments = await this.assignmentRepository.find({
                where: { module: { id: moduleId } },
                relations: ['module'],
                order: { createdAt: 'DESC' }
            });
            return assignments;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch assignments for module');
        }
    }
    async update(id, updateAssignmentDto) {
        try {
            const assignment = await this.findOne(id);
            const updateData = { ...updateAssignmentDto };
            if ('moduleId' in updateData && updateData.moduleId) {
                const module = await this.moduleRepository.findOne({
                    where: { id: updateData.moduleId }
                });
                if (!module) {
                    throw new common_1.NotFoundException(`Module with ID ${updateData.moduleId} not found`);
                }
                assignment.module = module;
                delete updateData.moduleId;
            }
            Object.assign(assignment, updateData);
            return await this.assignmentRepository.save(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update assignment');
        }
    }
    async toggleActive(id) {
        try {
            const assignment = await this.findOne(id);
            assignment.isActive = !assignment.isActive;
            return await this.assignmentRepository.save(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to toggle assignment status');
        }
    }
    async remove(id) {
        try {
            const assignment = await this.findOne(id);
            await this.assignmentRepository.remove(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete assignment');
        }
    }
    async getAssignmentStats(id) {
        try {
            const assignment = await this.findOne(id);
            const totalSubmissions = assignment.submissions?.length || 0;
            const submittedCount = assignment.submissions?.filter(s => s.status !== 'pending')?.length || 0;
            const gradedCount = assignment.submissions?.filter(s => s.status === 'reviewed' || s.status === 'approved' || s.status === 'rejected')?.length || 0;
            return {
                assignmentId: id,
                totalSubmissions,
                submittedCount,
                gradedCount,
                pendingGrading: submittedCount - gradedCount
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to get assignment statistics');
        }
    }
};
exports.AssignmentService = AssignmentService;
exports.AssignmentService = AssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentService);
//# sourceMappingURL=assignment.service.js.map