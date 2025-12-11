import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Module } from '../module/entities/module.entity';
export declare class AssignmentService {
    private assignmentRepository;
    private moduleRepository;
    constructor(assignmentRepository: Repository<Assignment>, moduleRepository: Repository<Module>);
    create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment>;
    findAll(): Promise<Assignment[]>;
    findActiveAssignments(): Promise<Assignment[]>;
    findOne(id: number): Promise<Assignment>;
    findByModule(moduleId: number): Promise<Assignment[]>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment>;
    toggleActive(id: number): Promise<Assignment>;
    remove(id: number): Promise<void>;
    getAssignmentStats(id: number): Promise<{
        assignmentId: number;
        totalSubmissions: number;
        submittedCount: number;
        gradedCount: number;
        pendingGrading: number;
    }>;
}
