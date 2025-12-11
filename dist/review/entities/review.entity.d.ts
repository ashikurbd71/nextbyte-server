import { User } from '../../users/entities/user.entity';
import { Course } from '../../course/entities/course.entity';
export declare class Review {
    id: number;
    rating: number;
    comment: string;
    isActive: boolean;
    user: User;
    course: Course;
    createdAt: Date;
    updatedAt: Date;
}
