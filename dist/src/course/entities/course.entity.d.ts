import { Category } from '../../categoris/entities/categoris.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../review/entities/review.entity';
import { Module } from '../../module/entities/module.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
export interface Technology {
    name: string;
    image: string;
}
export interface Assignment {
    moduleName: string;
    githubLink: string;
    liveLink: string;
}
export declare class Course {
    id: number;
    name: string;
    slugName: string;
    duration: string;
    price: number;
    discountPrice: number;
    totalJoin: number;
    totalSeat: number;
    whatYouWillLearn: string[];
    technologies: Technology[];
    requirements: string[];
    promoVideoUrl: string;
    courseVideosUrl: string[];
    thumbnail: string;
    facebookGroupLink: string;
    assignments: Assignment[];
    isActive: boolean;
    isPublished: boolean;
    totalModules: number;
    category: Category;
    instructors: Admin[];
    students: User[];
    reviews: Review[];
    modules: Module[];
    enrollments: Enrollment[];
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
