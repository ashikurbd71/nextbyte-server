import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin, JobType, AdminRole } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { EmailService } from './email.service';
export declare class AdminService {
    private adminRepository;
    private jwtService;
    private emailService;
    constructor(adminRepository: Repository<Admin>, jwtService: JwtService, emailService: EmailService);
    create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto>;
    login(loginAdminDto: LoginAdminDto): Promise<{
        admin: AdminResponseDto;
        token: string;
    }>;
    findAll(): Promise<AdminResponseDto[]>;
    findOne(id: number): Promise<AdminResponseDto>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto>;
    remove(id: number): Promise<void>;
    deactivate(id: number): Promise<AdminResponseDto>;
    activate(id: number): Promise<AdminResponseDto>;
    findByRole(role: AdminRole): Promise<AdminResponseDto[]>;
    findByJobType(jobType: JobType): Promise<AdminResponseDto[]>;
}
