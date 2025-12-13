import { User } from '../../users/entities/user.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
export declare enum SubmissionStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class AssignmentSubmission {
    id: number;
    description: string;
    githubLink: string;
    liveLink: string;
    fileUrl: string;
    marks: number;
    feedback: string;
    status: SubmissionStatus;
    reviewedAt: Date;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    assignmentTitle: string;
    moduleTitle: string;
    studentId: number;
    assignmentId: number;
    student: User;
    assignment: Assignment;
    createdAt: Date;
    updatedAt: Date;
}
