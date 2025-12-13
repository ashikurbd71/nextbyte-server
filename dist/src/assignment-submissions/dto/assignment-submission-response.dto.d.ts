import { SubmissionStatus } from '../entities/assignment-submission.entity';
export declare class AssignmentSubmissionResponseDto {
    id: number;
    description?: string;
    githubLink?: string;
    liveLink?: string;
    fileUrl?: string;
    marks?: number;
    feedback?: string;
    status: SubmissionStatus;
    reviewedAt?: Date;
    studentId: number;
    studentName?: string;
    studentEmail?: string;
    studentPhone?: string;
    assignmentId: number;
    assignmentTitle?: string;
    moduleTitle?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AssignmentSubmissionListResponseDto {
    id: number;
    assignmentTitle: string;
    moduleTitle: string;
    studentName: string;
    status: SubmissionStatus;
    marks?: number;
    submittedAt: Date;
    reviewedAt?: Date;
}
export declare class StudentPerformanceResponseDto {
    totalSubmissions: number;
    totalMarks: number;
    averageMarks: number;
    statusCounts: {
        pending: number;
        reviewed: number;
        approved: number;
        rejected: number;
    };
    submissions: Array<{
        id: number;
        assignmentTitle: string;
        marks?: number;
        status: SubmissionStatus;
        submittedAt: Date;
    }>;
}
