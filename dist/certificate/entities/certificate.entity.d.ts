import { User } from '../../users/entities/user.entity';
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
export declare class Certificate {
    id: number;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    completionPercentage: number;
    issuedDate: Date;
    expiryDate: Date;
    isActive: boolean;
    certificateUrl: string;
    certificatePdfUrl: string;
    student: User;
    course: Course;
    enrollment: Enrollment;
    createdAt: Date;
    updatedAt: Date;
}
