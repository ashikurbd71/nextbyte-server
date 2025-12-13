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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const admin_entity_1 = require("./entities/admin.entity");
const email_service_1 = require("./email.service");
let AdminService = class AdminService {
    adminRepository;
    jwtService;
    emailService;
    constructor(adminRepository, jwtService, emailService) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async create(createAdminDto) {
        const existingAdmin = await this.adminRepository.findOne({
            where: { email: createAdminDto.email }
        });
        if (existingAdmin) {
            throw new common_1.ConflictException('Admin with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
        const admin = this.adminRepository.create({
            ...createAdminDto,
            password: hashedPassword,
        });
        const savedAdmin = await this.adminRepository.save(admin);
        try {
            await this.emailService.sendAdminWelcomeEmail(createAdminDto.email, createAdminDto.name, createAdminDto.email, createAdminDto.password, createAdminDto.role || 'ADMIN');
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
        }
        const { password, ...adminWithoutPassword } = savedAdmin;
        return adminWithoutPassword;
    }
    async login(loginAdminDto) {
        const admin = await this.adminRepository.findOne({
            where: { email: loginAdminDto.email }
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!admin.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(loginAdminDto.password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role
        };
        const token = this.jwtService.sign(payload);
        const { password, ...adminWithoutPassword } = admin;
        return {
            admin: adminWithoutPassword,
            token
        };
    }
    async findAll() {
        const admins = await this.adminRepository.find({
            select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        return admins;
    }
    async findOne(id) {
        const admin = await this.adminRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return admin;
    }
    async update(id, updateAdminDto) {
        const admin = await this.adminRepository.findOne({ where: { id } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
            const existingAdmin = await this.adminRepository.findOne({
                where: { email: updateAdminDto.email }
            });
            if (existingAdmin) {
                throw new common_1.ConflictException('Admin with this email already exists');
            }
        }
        if (updateAdminDto.password) {
            updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
        }
        await this.adminRepository.update(id, updateAdminDto);
        const updatedAdmin = await this.adminRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        return updatedAdmin;
    }
    async remove(id) {
        const admin = await this.adminRepository.findOne({ where: { id } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        await this.adminRepository.remove(admin);
    }
    async deactivate(id) {
        const admin = await this.adminRepository.findOne({ where: { id } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        admin.isActive = false;
        await this.adminRepository.save(admin);
        const { password, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
    }
    async activate(id) {
        const admin = await this.adminRepository.findOne({ where: { id } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        admin.isActive = true;
        await this.adminRepository.save(admin);
        const { password, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
    }
    async findByRole(role) {
        const admins = await this.adminRepository.find({
            where: { role },
            select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        return admins;
    }
    async findByJobType(jobType) {
        const admins = await this.adminRepository.find({
            where: { jobType },
            select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
        return admins;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AdminService);
//# sourceMappingURL=admin.service.js.map