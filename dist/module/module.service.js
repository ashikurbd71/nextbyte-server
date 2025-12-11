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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_entity_1 = require("./entities/module.entity");
const course_entity_1 = require("../course/entities/course.entity");
const notification_service_1 = require("../notification/notification.service");
const enrollment_service_1 = require("../enrollment/enrollment.service");
let ModuleService = class ModuleService {
    moduleRepository;
    courseRepository;
    notificationService;
    enrollmentService;
    constructor(moduleRepository, courseRepository, notificationService, enrollmentService) {
        this.moduleRepository = moduleRepository;
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
        this.enrollmentService = enrollmentService;
    }
    async create(createModuleDto) {
        const course = await this.courseRepository.findOne({
            where: { id: createModuleDto.courseId }
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${createModuleDto.courseId} not found`);
        }
        const { courseId, ...moduleData } = createModuleDto;
        const module = this.moduleRepository.create({
            ...moduleData,
            course,
        });
        const savedModule = await this.moduleRepository.save(module);
        const enrollments = await this.enrollmentService.findByCourse(course.id);
        for (const enrollment of enrollments) {
            await this.notificationService.createNewModuleUploadNotification(enrollment.student.id, savedModule.title, course.name);
        }
        return savedModule;
    }
    async findAll() {
        return await this.moduleRepository.find({
            relations: ['course', 'lessons', 'assignments'],
            order: { order: 'ASC' }
        });
    }
    async findOne(id) {
        const module = await this.moduleRepository.findOne({
            where: { id },
            relations: ['course', 'lessons', 'assignments']
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module with ID ${id} not found`);
        }
        return module;
    }
    async findByCourse(courseId) {
        return await this.moduleRepository.find({
            where: { course: { id: courseId } },
            relations: ['lessons', 'assignments', 'course'],
            order: { order: 'ASC' }
        });
    }
    async update(id, updateModuleDto) {
        const module = await this.findOne(id);
        if (updateModuleDto.courseId) {
            const course = await this.courseRepository.findOne({
                where: { id: updateModuleDto.courseId }
            });
            if (!course) {
                throw new common_1.NotFoundException(`Course with ID ${updateModuleDto.courseId} not found`);
            }
            module.course = course;
        }
        const { courseId, ...updateData } = updateModuleDto;
        Object.assign(module, updateData);
        return await this.moduleRepository.save(module);
    }
    async remove(id) {
        const module = await this.findOne(id);
        await this.moduleRepository.remove(module);
    }
    async getModuleWithContent(moduleId) {
        const module = await this.findOne(moduleId);
        return {
            id: module.id,
            title: module.title,
            description: module.description,
            order: module.order,
            duration: module.duration,
            isActive: module.isActive,
            course: {
                id: module.course.id,
                name: module.course.name
            },
            lessons: module.lessons?.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                order: lesson.order,
                duration: lesson.duration,
                videoUrl: lesson.videoUrl,
                thumbnail: lesson.thumbnail,
                isPreview: lesson.isPreview,
                isActive: lesson.isActive
            })) || [],
            assignments: module.assignments?.map(assignment => ({
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                githubLink: assignment.githubLink,
                liveLink: assignment.liveLink,
                totalMarks: assignment.totalMarks,
                dueDate: assignment.dueDate,
                isActive: assignment.isActive
            })) || []
        };
    }
    async getModuleStatistics() {
        const totalModules = await this.moduleRepository.count();
        const activeModules = await this.moduleRepository.count({
            where: { isActive: true }
        });
        const modulesWithLessons = await this.moduleRepository
            .createQueryBuilder('module')
            .leftJoin('module.lessons', 'lesson')
            .select([
            'module.id as moduleId',
            'module.title as moduleTitle',
            'COUNT(lesson.id) as lessonCount'
        ])
            .groupBy('module.id')
            .getRawMany();
        const modulesWithAssignments = await this.moduleRepository
            .createQueryBuilder('module')
            .leftJoin('module.assignments', 'assignment')
            .select([
            'module.id as moduleId',
            'module.title as moduleTitle',
            'COUNT(assignment.id) as assignmentCount'
        ])
            .groupBy('module.id')
            .getRawMany();
        return {
            totalModules,
            activeModules,
            averageLessonsPerModule: modulesWithLessons.length > 0
                ? modulesWithLessons.reduce((sum, m) => sum + parseInt(m.lessonCount), 0) / modulesWithLessons.length
                : 0,
            averageAssignmentsPerModule: modulesWithAssignments.length > 0
                ? modulesWithAssignments.reduce((sum, m) => sum + parseInt(m.assignmentCount), 0) / modulesWithAssignments.length
                : 0,
            modulesWithContent: modulesWithLessons.map(m => ({
                moduleId: m.moduleId,
                moduleTitle: m.moduleTitle,
                lessonCount: parseInt(m.lessonCount)
            }))
        };
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        enrollment_service_1.EnrollmentService])
], ModuleService);
//# sourceMappingURL=module.service.js.map