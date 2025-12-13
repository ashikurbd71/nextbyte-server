import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<import("./entities/review.entity").Review>;
    canReviewCourse(courseId: number, req: any): Promise<{
        canReview: boolean;
        reason?: string;
    }>;
    findAll(): Promise<import("./entities/review.entity").Review[]>;
    findMyReviews(req: any): Promise<import("./entities/review.entity").Review[]>;
    findByStudent(studentId: number): Promise<import("./entities/review.entity").Review[]>;
    findByCourse(courseId: number): Promise<import("./entities/review.entity").Review[]>;
    getCourseRating(courseId: number): Promise<any>;
    getTopRatedCourses(limit?: number): Promise<any[]>;
    findOne(id: number): Promise<import("./entities/review.entity").Review>;
    update(id: number, updateReviewDto: UpdateReviewDto): Promise<import("./entities/review.entity").Review>;
    remove(id: number): Promise<void>;
}
