import { Repository } from 'typeorm';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';
import { Category } from './entities/categoris.entity';
export declare class CategorisService {
    private categorisRepository;
    constructor(categorisRepository: Repository<Category>);
    create(createCategorisDto: CreateCategorisDto): Promise<{
        statusCode: number;
        message: string;
        data: Category;
    }>;
    findAll(): Promise<{
        statusCode: number;
        message: string;
        data: Category[];
        count: number;
    }>;
    findOne(id: number): Promise<{
        statusCode: number;
        message: string;
        data: Category;
    }>;
    update(id: number, updateCategorisDto: UpdateCategorisDto): Promise<{
        statusCode: number;
        message: string;
        data: Category | null;
    }>;
    remove(id: number): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: number;
        };
    }>;
}
