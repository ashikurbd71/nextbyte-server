import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Course } from '../course/entities/course.entity';
import { User } from '../users/entities/user.entity';
export declare class ReviewService {
    private reviewRepository;
    private courseRepository;
    private userRepository;
    constructor(reviewRepository: Repository<Review>, courseRepository: Repository<Course>, userRepository: Repository<User>);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    private updateCourseAverageRating;
    validateUserCanReview(userId: number, courseId: number): Promise<{
        canReview: boolean;
        reason?: string;
    }>;
    findAll(): Promise<Review[]>;
    findOne(id: number): Promise<Review>;
    findByCourse(courseId: number): Promise<Review[]>;
    findByUser(userId: number): Promise<Review[]>;
    findByUserEntity(user: User): Promise<Review[]>;
    findUserReviewForCourse(userId: number, courseId: number): Promise<Review | null>;
    update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review>;
    remove(id: number): Promise<void>;
    getCourseRating(courseId: number): Promise<any>;
    getTopRatedCourses(limit?: number): Promise<any[]>;
}
