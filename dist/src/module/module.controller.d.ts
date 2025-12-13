import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    create(createModuleDto: CreateModuleDto): Promise<import("./entities/module.entity").Module>;
    findAll(): Promise<import("./entities/module.entity").Module[]>;
    findByCourse(courseId: number): Promise<import("./entities/module.entity").Module[]>;
    getModuleStatistics(): Promise<any>;
    findOne(id: number): Promise<import("./entities/module.entity").Module>;
    getModuleWithContent(id: number): Promise<any>;
    update(id: number, updateModuleDto: UpdateModuleDto): Promise<import("./entities/module.entity").Module>;
    remove(id: number): Promise<void>;
}
