"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entities/user.entity");
const email_service_1 = require("../admin/email.service");
const axios_1 = require("axios");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    emailService;
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async generateOtp() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    async sendSms(phone, otp) {
        try {
            const apiKey = process.env.BULKSMS_API_KEY;
            const apiUrl = 'https://bulksmsbd.net/api/smsapi';
            const response = await axios_1.default.post(apiUrl, {
                api_key: apiKey,
                type: 'text',
                number: phone,
                senderid: '8809617625025',
                message: `Hello!, Your NextByte Academy Sign-in OTP is: ${otp}.Please do NOT share your OTP with others!.`
            });
            console.log('SMS sent successfully:', response.data);
        }
        catch (error) {
            console.error('SMS sending failed:', error);
            console.log(`Development OTP for ${phone}: ${otp}`);
        }
    }
    async register(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { phone: createUserDto.phone }
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this phone number already exists');
        }
        if (createUserDto.email) {
            const existingEmail = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });
            if (existingEmail) {
                throw new common_1.BadRequestException('User with this email already exists');
            }
        }
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);
        if (createUserDto.email) {
            try {
                await this.emailService.sendWelcomeEmail(createUserDto.email, createUserDto.name || 'User');
            }
            catch (error) {
                console.error('Failed to send welcome email:', error);
            }
        }
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        savedUser.lastOtp = otp;
        savedUser.otpExpiry = otpExpiry;
        await this.userRepository.save(savedUser);
        await this.sendSms(createUserDto.phone, otp);
        return {
            message: 'User registered successfully. Please verify your phone number with the OTP sent.',
            user: {
                id: savedUser.id,
                name: savedUser.name,
                phone: savedUser.phone,
                email: savedUser.email,
                isVerified: savedUser.isVerified,
            },
            phone: createUserDto.phone,
        };
    }
    async login(loginDto) {
        const { phone } = loginDto;
        const user = await this.userRepository.findOne({ where: { phone } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found. Please register first.');
        }
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.lastOtp = otp;
        user.otpExpiry = otpExpiry;
        await this.userRepository.save(user);
        await this.sendSms(phone, otp);
        return {
            message: 'OTP sent successfully',
            phone: phone,
        };
    }
    async verifyOtp(verifyOtpDto) {
        const { phone, otp } = verifyOtpDto;
        const user = await this.userRepository.findOne({ where: { phone } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.lastOtp !== otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (user.otpExpiry && new Date() > user.otpExpiry) {
            throw new common_1.BadRequestException('OTP expired');
        }
        user.isVerified = true;
        user.lastOtp = null;
        user.otpExpiry = null;
        await this.userRepository.save(user);
        const payload = { sub: user.id, phone: user.phone };
        const token = this.jwtService.sign(payload, {
            expiresIn: '215d',
        });
        return {
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photoUrl: user.photoUrl,
                address: user.address,
                age: user.age,
                instituteName: user.instituteName,
                semester: user.semester,
                subject: user.subject,
                isVerified: user.isVerified,
                isActive: user.isActive,
                isBanned: user.isBanned,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }
    async resendOtp(resendOtpDto) {
        const { phone } = resendOtpDto;
        const user = await this.userRepository.findOne({ where: { phone } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.lastOtp = otp;
        user.otpExpiry = otpExpiry;
        await this.userRepository.save(user);
        await this.sendSms(phone, otp);
        return {
            message: 'New OTP sent successfully',
            phone: phone,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map