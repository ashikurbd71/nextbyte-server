import { AssignmentSubmissionsService } from './assignment-submissions.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { DeleteSubmissionDto } from './dto/delete-submission.dto';
import { AssignmentSubmissionResponseDto, StudentPerformanceResponseDto } from './dto/assignment-submission-response.dto';
export declare class AssignmentSubmissionsController {
    private readonly assignmentSubmissionsService;
    constructor(assignmentSubmissionsService: AssignmentSubmissionsService);
    create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto): Promise<AssignmentSubmissionResponseDto>;
    findAll(): Promise<AssignmentSubmissionResponseDto[]>;
    findByStudent(studentId: number): Promise<AssignmentSubmissionResponseDto[]>;
    findByAssignment(assignmentId: number): Promise<AssignmentSubmissionResponseDto[]>;
    findByUserAndAssignment(userId: number, assignmentId: number): Promise<AssignmentSubmissionResponseDto | null>;
    getStudentPerformance(studentId: number): Promise<StudentPerformanceResponseDto>;
    findOne(id: number): Promise<AssignmentSubmissionResponseDto>;
    update(id: number, updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto): Promise<AssignmentSubmissionResponseDto>;
    reviewSubmission(id: number, reviewDto: ReviewSubmissionDto): Promise<AssignmentSubmissionResponseDto>;
    remove(id: number, deleteDto: DeleteSubmissionDto): Promise<{
        message: string;
    }>;
}
