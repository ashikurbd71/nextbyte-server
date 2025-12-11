import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    getProfile(req: any): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
    findActiveUsers(): Promise<import("./entities/user.entity").User[]>;
    findBannedUsers(): Promise<import("./entities/user.entity").User[]>;
    getUsersStats(): Promise<{
        total: number;
        active: number;
        banned: number;
        verified: number;
        unverified: number;
        deleted: number;
    }>;
    banUser(id: string, banUserDto: BanUserDto): Promise<import("./entities/user.entity").User>;
    unbanUser(id: string): Promise<import("./entities/user.entity").User>;
    activateUser(id: string): Promise<import("./entities/user.entity").User>;
    deactivateUser(id: string): Promise<import("./entities/user.entity").User>;
    verifyUser(id: string): Promise<import("./entities/user.entity").User>;
    findByStudentId(studentId: string): Promise<import("./entities/user.entity").User>;
}
