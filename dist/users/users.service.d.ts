import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findActiveUsers(): Promise<User[]>;
    findBannedUsers(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByPhone(phone: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByStudentId(studentId: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    updateProfileImage(id: number, photoUrl: string): Promise<User>;
    remove(id: number): Promise<void>;
    banUser(id: number, banUserDto: BanUserDto): Promise<User>;
    unbanUser(id: number): Promise<User>;
    activateUser(id: number): Promise<User>;
    deactivateUser(id: number): Promise<User>;
    verifyUser(id: number): Promise<User>;
    getUsersStats(): Promise<{
        total: number;
        active: number;
        banned: number;
        verified: number;
        unverified: number;
        deleted: number;
    }>;
    private generateStudentId;
    private generateStudentIdWithOffset;
}
