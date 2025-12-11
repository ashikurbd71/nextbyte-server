import { Course } from '../../course/entities/course.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    courses: Course[];
    createdAt: Date;
    updatedAt: Date;
}
