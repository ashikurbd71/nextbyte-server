import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentController {
    private readonly assignmentService;
    constructor(assignmentService: AssignmentService);
    create(createAssignmentDto: CreateAssignmentDto): Promise<import("./entities/assignment.entity").Assignment>;
    findAll(): Promise<import("./entities/assignment.entity").Assignment[]>;
    findActiveAssignments(): Promise<import("./entities/assignment.entity").Assignment[]>;
    findByModule(moduleId: number): Promise<import("./entities/assignment.entity").Assignment[]>;
    findOne(id: number): Promise<import("./entities/assignment.entity").Assignment>;
    getAssignmentStats(id: number): Promise<{
        assignmentId: number;
        totalSubmissions: number;
        submittedCount: number;
        gradedCount: number;
        pendingGrading: number;
    }>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<import("./entities/assignment.entity").Assignment>;
    toggleActive(id: number): Promise<import("./entities/assignment.entity").Assignment>;
    remove(id: number): Promise<void>;
}
