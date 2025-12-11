import { CategorisService } from './categoris.service';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';
export declare class CategorisController {
    private readonly categorisService;
    constructor(categorisService: CategorisService);
    create(createCategorisDto: CreateCategorisDto): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/categoris.entity").Category;
    }>;
    findAll(): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/categoris.entity").Category[];
        count: number;
    }>;
    findOne(id: number): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/categoris.entity").Category;
    }>;
    update(id: number, updateCategorisDto: UpdateCategorisDto): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/categoris.entity").Category | null;
    }>;
    remove(id: number): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: number;
        };
    }>;
}
