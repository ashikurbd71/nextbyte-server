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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
const categoris_entity_1 = require("../categoris/entities/categoris.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
let CourseService = class CourseService {
    courseRepository;
    categoryRepository;
    adminRepository;
    constructor(courseRepository, categoryRepository, adminRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.adminRepository = adminRepository;
    }
    async create(createCourseDto) {
        try {
            if (!createCourseDto.name || !createCourseDto.slugName) {
                throw new common_1.BadRequestException('Course name and slug name are required');
            }
            const existingCourse = await this.courseRepository.findOne({
                where: { slugName: createCourseDto.slugName }
            });
            if (existingCourse) {
                throw new common_1.BadRequestException(`Course with slug name '${createCourseDto.slugName}' already exists`);
            }
            const category = await this.categoryRepository.findOne({
                where: { id: createCourseDto.categoryId }
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${createCourseDto.categoryId} not found`);
            }
            const instructors = await this.adminRepository.find({
                where: { id: (0, typeorm_2.In)(createCourseDto.instructorIds) }
            });
            if (instructors.length === 0) {
                throw new common_1.NotFoundException(`No instructors found with the provided IDs: ${createCourseDto.instructorIds.join(', ')}`);
            }
            if (createCourseDto.discountPrice && createCourseDto.discountPrice >= createCourseDto.price) {
                throw new common_1.BadRequestException('Discount price must be less than regular price');
            }
            const { categoryId, instructorIds, ...courseData } = createCourseDto;
            const course = this.courseRepository.create({
                ...courseData,
                category,
                instructors: instructors,
                totalJoin: 0,
                isActive: createCourseDto.isActive ?? true,
                isPublished: createCourseDto.isPublished ?? false,
            });
            return await this.courseRepository.save(course);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create course: ' + error.message);
        }
    }
    async findAll() {
        return await this.courseRepository.find({
            relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user']
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    async update(id, updateCourseDto) {
        const course = await this.findOne(id);
        if (updateCourseDto.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateCourseDto.categoryId }
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${updateCourseDto.categoryId} not found`);
            }
            course.category = category;
        }
        if (updateCourseDto.instructorIds) {
            const instructors = await this.adminRepository.find({
                where: { id: (0, typeorm_2.In)(updateCourseDto.instructorIds) }
            });
            if (instructors.length === 0) {
                throw new common_1.NotFoundException(`No instructors found with the provided IDs: ${updateCourseDto.instructorIds.join(', ')}`);
            }
            if (!course.instructors) {
                course.instructors = [];
            }
            course.instructors = instructors;
        }
        const { categoryId, instructorIds, ...updateData } = updateCourseDto;
        Object.assign(course, updateData);
        return await this.courseRepository.save(course);
    }
    async remove(id) {
        const course = await this.findOne(id);
        await this.courseRepository.remove(course);
    }
    async findByCategory(categoryId) {
        return await this.courseRepository.find({
            where: { category: { id: categoryId } },
            relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByInstructor(instructorId) {
        return await this.courseRepository.find({
            where: { instructors: { id: instructorId } },
            relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'reviews.user'],
            order: { createdAt: 'DESC' }
        });
    }
    async enrollStudent(courseId, studentId) {
        const course = await this.findOne(courseId);
        course.students = course.students || [];
        course.students.push({ id: studentId });
        course.totalJoin += 1;
        return await this.courseRepository.save(course);
    }
    async getCourseStatistics() {
        const totalCourses = await this.courseRepository.count();
        const publishedCourses = await this.courseRepository.count({
            where: { isPublished: true }
        });
        const activeCourses = await this.courseRepository.count({
            where: { isActive: true }
        });
        const totalEnrollments = await this.courseRepository
            .createQueryBuilder('course')
            .select('SUM(course.totalJoin)', 'total')
            .getRawOne();
        return {
            totalCourses,
            publishedCourses,
            activeCourses,
            totalEnrollments: totalEnrollments?.total || 0,
            averageEnrollments: totalCourses > 0 ? (totalEnrollments?.total || 0) / totalCourses : 0
        };
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(1, (0, typeorm_1.InjectRepository)(categoris_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map