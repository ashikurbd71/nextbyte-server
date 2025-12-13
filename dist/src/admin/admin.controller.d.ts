import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto;
    }>;
    login(loginAdminDto: LoginAdminDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            admin: AdminResponseDto;
            token: string;
        };
    }>;
    findAll(): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto;
    }>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto;
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    deactivate(id: string): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto;
    }>;
    activate(id: string): Promise<{
        statusCode: number;
        message: string;
        data: AdminResponseDto;
    }>;
}
