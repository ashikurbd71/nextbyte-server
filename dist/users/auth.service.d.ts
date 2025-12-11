import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../admin/email.service';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private emailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService);
    generateOtp(): Promise<string>;
    sendSms(phone: string, otp: string): Promise<void>;
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            phone: string;
            email: string;
            isVerified: boolean;
        };
        phone: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        phone: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            photoUrl: string;
            address: string;
            age: number;
            instituteName: string;
            semester: string;
            subject: string;
            isVerified: boolean;
            isActive: boolean;
            isBanned: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        message: string;
        phone: string;
    }>;
}
