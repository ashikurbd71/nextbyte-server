import { SubmissionStatus } from '../entities/assignment-submission.entity';
export declare class ReviewSubmissionDto {
    marks: number;
    feedback?: string;
    status: SubmissionStatus;
}
