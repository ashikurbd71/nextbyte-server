import { Course } from '../../course/entities/course.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
export declare class Module {
    id: number;
    title: string;
    description: string;
    order: number;
    duration: string;
    isActive: boolean;
    course: Course;
    lessons: Lesson[];
    assignments: Assignment[];
    createdAt: Date;
    updatedAt: Date;
}
