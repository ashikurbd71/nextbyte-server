import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Course } from '../course/entities/course.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { NotificationService } from '../notification/notification.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
export declare class ModuleService {
    private moduleRepository;
    private courseRepository;
    private notificationService;
    private enrollmentService;
    constructor(moduleRepository: Repository<Module>, courseRepository: Repository<Course>, notificationService: NotificationService, enrollmentService: EnrollmentService);
    create(createModuleDto: CreateModuleDto): Promise<Module>;
    findAll(): Promise<Module[]>;
    findOne(id: number): Promise<Module>;
    findByCourse(courseId: number): Promise<Module[]>;
    update(id: number, updateModuleDto: UpdateModuleDto): Promise<Module>;
    remove(id: number): Promise<void>;
    getModuleWithContent(moduleId: number): Promise<any>;
    getModuleStatistics(): Promise<any>;
}
