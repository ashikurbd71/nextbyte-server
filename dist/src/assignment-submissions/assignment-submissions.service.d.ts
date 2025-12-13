import { Repository } from 'typeorm';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { User } from '../users/entities/user.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { NotificationService } from '../notification/notification.service';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class AssignmentSubmissionsService {
    private assignmentSubmissionRepository;
    private userRepository;
    private assignmentRepository;
    private notificationService;
    constructor(assignmentSubmissionRepository: Repository<AssignmentSubmission>, userRepository: Repository<User>, assignmentRepository: Repository<Assignment>, notificationService: NotificationService);
    create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto): Promise<AssignmentSubmission>;
    findAll(): Promise<AssignmentSubmission[]>;
    findOne(id: number): Promise<AssignmentSubmission>;
    findByStudent(studentId: number): Promise<AssignmentSubmission[]>;
    findByAssignment(assignmentId: number): Promise<AssignmentSubmission[]>;
    findByUserAndAssignment(userId: number, assignmentId: number): Promise<AssignmentSubmission | null>;
    update(id: number, updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto): Promise<AssignmentSubmission>;
    reviewSubmission(id: number, reviewDto: ReviewSubmissionDto): Promise<AssignmentSubmission>;
    remove(id: number, userId: number): Promise<void>;
    getStudentPerformance(studentId: number): Promise<any>;
    private findUserById;
    private findAssignmentById;
}
