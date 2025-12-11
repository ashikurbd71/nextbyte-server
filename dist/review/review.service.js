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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const course_entity_1 = require("../course/entities/course.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ReviewService = class ReviewService {
    reviewRepository;
    courseRepository;
    userRepository;
    constructor(reviewRepository, courseRepository, userRepository) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }
    async create(createReviewDto) {
        const course = await this.courseRepository.findOne({
            where: { id: createReviewDto.courseId }
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${createReviewDto.courseId} not found`);
        }
        const user = await this.userRepository.findOne({
            where: { id: createReviewDto.userId }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createReviewDto.userId} not found`);
        }
        if (!user.isActive) {
            throw new common_1.NotFoundException('User account is not active');
        }
        if (user.isBanned) {
            throw new common_1.NotFoundException('User account is banned');
        }
        const isEnrolled = await this.courseRepository
            .createQueryBuilder('course')
            .innerJoin('course.students', 'student')
            .where('course.id = :courseId', { courseId: createReviewDto.courseId })
            .andWhere('student.id = :userId', { userId: createReviewDto.userId })
            .getOne();
        if (!isEnrolled) {
            throw new common_1.NotFoundException('You must be enrolled in this course to review it');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: { user: { id: createReviewDto.userId }, course: { id: createReviewDto.courseId } }
        });
        if (existingReview) {
            throw new common_1.NotFoundException('You have already reviewed this course');
        }
        const review = this.reviewRepository.create({
            rating: createReviewDto.rating,
            comment: createReviewDto.comment,
            isActive: createReviewDto.isActive ?? true,
            user: user,
            course: course
        });
        const savedReview = await this.reviewRepository.save(review);
        await this.updateCourseAverageRating(createReviewDto.courseId);
        return savedReview;
    }
    async updateCourseAverageRating(courseId) {
        const ratingData = await this.getCourseRating(courseId);
    }
    async validateUserCanReview(userId, courseId) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            return { canReview: false, reason: 'User not found' };
        }
        if (!user.isActive) {
            return { canReview: false, reason: 'User account is not active' };
        }
        if (user.isBanned) {
            return { canReview: false, reason: 'User account is banned' };
        }
        const course = await this.courseRepository.findOne({
            where: { id: courseId }
        });
        if (!course) {
            return { canReview: false, reason: 'Course not found' };
        }
        const isEnrolled = await this.courseRepository
            .createQueryBuilder('course')
            .innerJoin('course.students', 'student')
            .where('course.id = :courseId', { courseId })
            .andWhere('student.id = :userId', { userId })
            .getOne();
        if (!isEnrolled) {
            return { canReview: false, reason: 'You must be enrolled in this course to review it' };
        }
        const existingReview = await this.findUserReviewForCourse(userId, courseId);
        if (existingReview) {
            return { canReview: false, reason: 'You have already reviewed this course' };
        }
        return { canReview: true };
    }
    async findAll() {
        return await this.reviewRepository.find({
            relations: ['user', 'course'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['user', 'course']
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }
    async findByCourse(courseId) {
        return await this.reviewRepository.find({
            where: { course: { id: courseId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByUser(userId) {
        return await this.reviewRepository.find({
            where: { user: { id: userId } },
            relations: ['course'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByUserEntity(user) {
        return await this.reviewRepository.find({
            where: { user: { id: user.id } },
            relations: ['course'],
            order: { createdAt: 'DESC' }
        });
    }
    async findUserReviewForCourse(userId, courseId) {
        return await this.reviewRepository.findOne({
            where: {
                user: { id: userId },
                course: { id: courseId }
            },
            relations: ['user', 'course']
        });
    }
    async update(id, updateReviewDto) {
        const review = await this.findOne(id);
        Object.assign(review, updateReviewDto);
        return await this.reviewRepository.save(review);
    }
    async remove(id) {
        const review = await this.findOne(id);
        await this.reviewRepository.remove(review);
    }
    async getCourseRating(courseId) {
        const reviews = await this.findByCourse(courseId);
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
                }
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const ratingDistribution = {
            1: reviews.filter(r => r.rating === 1).length,
            2: reviews.filter(r => r.rating === 2).length,
            3: reviews.filter(r => r.rating === 3).length,
            4: reviews.filter(r => r.rating === 4).length,
            5: reviews.filter(r => r.rating === 5).length
        };
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            ratingDistribution
        };
    }
    async getTopRatedCourses(limit = 10) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select([
            'course.id as courseId',
            'course.name as courseName',
            'AVG(review.rating) as averageRating',
            'COUNT(review.id) as totalReviews'
        ])
            .leftJoin('review.course', 'course')
            .groupBy('course.id')
            .having('COUNT(review.id) >= 1')
            .orderBy('averageRating', 'DESC')
            .addOrderBy('totalReviews', 'DESC')
            .limit(limit)
            .getRawMany();
        return result.map(item => ({
            courseId: item.courseId,
            courseName: item.courseName,
            averageRating: Math.round(parseFloat(item.averageRating) * 10) / 10,
            totalReviews: parseInt(item.totalReviews)
        }));
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewService);
//# sourceMappingURL=review.service.js.map