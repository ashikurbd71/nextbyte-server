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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
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
        const studentId = await this.generateStudentId();
        const user = this.userRepository.create({
            ...createUserDto,
            studentId
        });
        return await this.userRepository.save(user);
    }
    async findAll() {
        return await this.userRepository.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' }
        });
    }
    async findActiveUsers() {
        return await this.userRepository.find({
            where: { isActive: true, isBanned: false },
            order: { createdAt: 'DESC' }
        });
    }
    async findBannedUsers() {
        return await this.userRepository.find({
            where: { isBanned: true },
            order: { bannedAt: 'DESC' }
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByPhone(phone) {
        const user = await this.userRepository.findOne({
            where: { phone, isDeleted: false }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with phone ${phone} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email, isDeleted: false }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async findByStudentId(studentId) {
        const user = await this.userRepository.findOne({
            where: { studentId, isDeleted: false }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with student ID ${studentId} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email }
            });
            if (existingEmail) {
                throw new common_1.BadRequestException('User with this email already exists');
            }
        }
        if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
            const existingPhone = await this.userRepository.findOne({
                where: { phone: updateUserDto.phone }
            });
            if (existingPhone) {
                throw new common_1.BadRequestException('User with this phone number already exists');
            }
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }
    async updateProfileImage(id, photoUrl) {
        const user = await this.findOne(id);
        user.photoUrl = photoUrl;
        return await this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        user.isDeleted = true;
        user.deletedAt = new Date();
        user.isActive = false;
        await this.userRepository.save(user);
    }
    async banUser(id, banUserDto) {
        const user = await this.findOne(id);
        if (user.isBanned) {
            throw new common_1.BadRequestException('User is already banned');
        }
        user.isBanned = true;
        user.isActive = false;
        user.banReason = banUserDto.reason;
        user.bannedAt = new Date();
        return await this.userRepository.save(user);
    }
    async unbanUser(id) {
        const user = await this.findOne(id);
        if (!user.isBanned) {
            throw new common_1.BadRequestException('User is not banned');
        }
        user.isBanned = false;
        user.isActive = true;
        user.banReason = null;
        user.bannedAt = null;
        return await this.userRepository.save(user);
    }
    async activateUser(id) {
        const user = await this.findOne(id);
        if (user.isActive) {
            throw new common_1.BadRequestException('User is already active');
        }
        if (user.isBanned) {
            throw new common_1.BadRequestException('Cannot activate a banned user. Unban the user first.');
        }
        user.isActive = true;
        return await this.userRepository.save(user);
    }
    async deactivateUser(id) {
        const user = await this.findOne(id);
        if (!user.isActive) {
            throw new common_1.BadRequestException('User is already inactive');
        }
        user.isActive = false;
        return await this.userRepository.save(user);
    }
    async verifyUser(id) {
        const user = await this.findOne(id);
        if (user.isVerified) {
            throw new common_1.BadRequestException('User is already verified');
        }
        user.isVerified = true;
        return await this.userRepository.save(user);
    }
    async getUsersStats() {
        const [total, active, banned, verified, unverified, deleted] = await Promise.all([
            this.userRepository.count({ where: { isDeleted: false } }),
            this.userRepository.count({ where: { isActive: true, isBanned: false, isDeleted: false } }),
            this.userRepository.count({ where: { isBanned: true, isDeleted: false } }),
            this.userRepository.count({ where: { isVerified: true, isDeleted: false } }),
            this.userRepository.count({ where: { isVerified: false, isDeleted: false } }),
            this.userRepository.count({ where: { isDeleted: true } }),
        ]);
        return { total, active, banned, verified, unverified, deleted };
    }
    async generateStudentId() {
        const userCount = await this.userRepository.count();
        const nextNumber = userCount + 1;
        const paddedNumber = nextNumber.toString().padStart(6, '0');
        const studentId = `NEXTBYTE-${paddedNumber}`;
        const existingUser = await this.userRepository.findOne({
            where: { studentId }
        });
        if (existingUser) {
            return this.generateStudentIdWithOffset(nextNumber + 1);
        }
        return studentId;
    }
    async generateStudentIdWithOffset(startNumber) {
        let number = startNumber;
        let studentId;
        let existingUser;
        do {
            const paddedNumber = number.toString().padStart(6, '0');
            studentId = `NEXTBYTE-${paddedNumber}`;
            existingUser = await this.userRepository.findOne({
                where: { studentId }
            });
            number++;
        } while (existingUser);
        return studentId;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map