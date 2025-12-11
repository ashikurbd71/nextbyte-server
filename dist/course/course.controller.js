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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const course_response_dto_1 = require("./dto/course-response.dto");
let CourseController = class CourseController {
    courseService;
    constructor(courseService) {
        this.courseService = courseService;
    }
    async create(createCourseDto) {
        try {
            const course = await this.courseService.create(createCourseDto);
            return {
                success: true,
                message: 'Course created successfully',
                data: course
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async findAll() {
        try {
            const courses = await this.courseService.findAll();
            return {
                success: true,
                data: courses,
                count: courses.length
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async getCourseStatistics() {
        try {
            const statistics = await this.courseService.getCourseStatistics();
            return {
                success: true,
                data: statistics
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async findByCategory(categoryId) {
        try {
            const courses = await this.courseService.findByCategory(categoryId);
            return {
                success: true,
                data: courses,
                count: courses.length
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async findByInstructor(instructorId) {
        try {
            const courses = await this.courseService.findByInstructor(instructorId);
            return {
                success: true,
                data: courses,
                count: courses.length
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async findOne(id) {
        try {
            const course = await this.courseService.findOne(id);
            return {
                success: true,
                data: course
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async update(id, updateCourseDto) {
        try {
            const course = await this.courseService.update(id, updateCourseDto);
            return {
                success: true,
                message: 'Course updated successfully',
                data: course
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async enrollStudent(courseId, studentId) {
        try {
            const course = await this.courseService.enrollStudent(courseId, studentId);
            return {
                success: true,
                message: 'Student enrolled successfully',
                data: course
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
    async remove(id) {
        try {
            await this.courseService.remove(id);
            return {
                success: true,
                message: 'Course deleted successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.response || error.message
            };
        }
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course' }),
    (0, swagger_1.ApiBody)({ type: create_course_dto_1.CreateCourseDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Course created successfully',
        type: course_response_dto_1.CourseSingleResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
        type: course_response_dto_1.CourseErrorResponseDto
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of courses retrieved successfully',
        type: course_response_dto_1.CourseListResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get course statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course statistics retrieved successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseStatistics", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by category' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses by category retrieved successfully',
        type: course_response_dto_1.CourseListResponseDto
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('instructor/:instructorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by instructor' }),
    (0, swagger_1.ApiParam)({ name: 'instructorId', description: 'Instructor ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses by instructor retrieved successfully',
        type: course_response_dto_1.CourseListResponseDto
    }),
    __param(0, (0, common_1.Param)('instructorId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findByInstructor", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a course by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course retrieved successfully',
        type: course_response_dto_1.CourseSingleResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
        type: course_response_dto_1.CourseErrorResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a course' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiBody)({ type: update_course_dto_1.UpdateCourseDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course updated successfully',
        type: course_response_dto_1.CourseSingleResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
        type: course_response_dto_1.CourseErrorResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/enroll/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll a student in a course' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student enrolled successfully',
        type: course_response_dto_1.CourseSingleResponseDto
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "enrollStudent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a course' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Course deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
        type: course_response_dto_1.CourseErrorResponseDto
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "remove", null);
exports.CourseController = CourseController = __decorate([
    (0, swagger_1.ApiTags)('courses'),
    (0, common_1.Controller)('course'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
//# sourceMappingURL=course.controller.js.map