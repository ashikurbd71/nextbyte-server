import { Module } from '../../module/entities/module.entity';
import { AssignmentSubmission } from '../../assignment-submissions/entities/assignment-submission.entity';
export declare class Assignment {
    id: number;
    title: string;
    description: string;
    githubLink: string;
    liveLink: string;
    totalMarks: number;
    dueDate: Date;
    isActive: boolean;
    module: Module;
    submissions: AssignmentSubmission[];
    createdAt: Date;
    updatedAt: Date;
}
