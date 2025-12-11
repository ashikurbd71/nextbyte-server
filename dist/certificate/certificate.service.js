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
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("./entities/certificate.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const course_entity_1 = require("../course/entities/course.entity");
let CertificateService = class CertificateService {
    certificateRepository;
    enrollmentRepository;
    userRepository;
    courseRepository;
    constructor(certificateRepository, enrollmentRepository, userRepository, courseRepository) {
        this.certificateRepository = certificateRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    async create(createCertificateDto) {
        const certificate = this.certificateRepository.create({
            ...createCertificateDto,
            certificateNumber: this.generateCertificateNumber(),
            issuedDate: new Date(),
        });
        return await this.certificateRepository.save(certificate);
    }
    async findAll() {
        return await this.certificateRepository.find({
            relations: ['student', 'course', 'enrollment'],
        });
    }
    async findOne(id) {
        const certificate = await this.certificateRepository.findOne({
            where: { id },
            relations: ['student', 'course', 'enrollment'],
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${id} not found`);
        }
        return certificate;
    }
    async findByStudent(studentId, options) {
        const queryBuilder = this.certificateRepository
            .createQueryBuilder('certificate')
            .leftJoinAndSelect('certificate.student', 'student')
            .leftJoinAndSelect('certificate.course', 'course')
            .leftJoinAndSelect('certificate.enrollment', 'enrollment')
            .where('certificate.student.id = :studentId', { studentId });
        if (options?.isActive !== undefined) {
            queryBuilder.andWhere('certificate.isActive = :isActive', { isActive: options.isActive });
        }
        if (options?.sortBy) {
            const sortOrder = options.sortOrder || 'DESC';
            switch (options.sortBy) {
                case 'issuedDate':
                    queryBuilder.orderBy('certificate.issuedDate', sortOrder);
                    break;
                case 'courseName':
                    queryBuilder.orderBy('certificate.courseName', sortOrder);
                    break;
                case 'completionPercentage':
                    queryBuilder.orderBy('certificate.completionPercentage', sortOrder);
                    break;
                default:
                    queryBuilder.orderBy('certificate.issuedDate', 'DESC');
            }
        }
        else {
            queryBuilder.orderBy('certificate.issuedDate', 'DESC');
        }
        if (options?.limit) {
            queryBuilder.limit(options.limit);
        }
        if (options?.offset) {
            queryBuilder.offset(options.offset);
        }
        return await queryBuilder.getMany();
    }
    async findByCourse(courseId) {
        return await this.certificateRepository.find({
            where: { course: { id: courseId } },
            relations: ['student', 'course', 'enrollment'],
        });
    }
    async update(id, updateCertificateDto) {
        const certificate = await this.findOne(id);
        Object.assign(certificate, updateCertificateDto);
        return await this.certificateRepository.save(certificate);
    }
    async remove(id) {
        const certificate = await this.findOne(id);
        await this.certificateRepository.remove(certificate);
    }
    async generateCertificate(generateCertificateDto) {
        const { enrollmentId, certificateUrl, certificatePdfUrl } = generateCertificateDto;
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id: enrollmentId },
            relations: ['student', 'course'],
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment with ID ${enrollmentId} not found`);
        }
        if (enrollment.progress < 100) {
            throw new common_1.BadRequestException('Course must be 100% completed to generate certificate');
        }
        const existingCertificate = await this.certificateRepository.findOne({
            where: { enrollment: { id: enrollmentId } },
        });
        if (existingCertificate) {
            throw new common_1.BadRequestException('Certificate already exists for this enrollment');
        }
        const certificate = this.certificateRepository.create({
            certificateNumber: this.generateCertificateNumber(),
            studentName: enrollment.student.name || 'Unknown Student',
            courseName: enrollment.course.name,
            completionPercentage: enrollment.progress,
            issuedDate: new Date(),
            certificateUrl,
            certificatePdfUrl,
            student: enrollment.student,
            course: enrollment.course,
            enrollment: enrollment,
        });
        return await this.certificateRepository.save(certificate);
    }
    async generateCertificateForCompletedCourse(enrollmentId) {
        return await this.generateCertificate({ enrollmentId });
    }
    async verifyCertificate(certificateNumber) {
        const certificate = await this.certificateRepository.findOne({
            where: { certificateNumber },
            relations: ['student', 'course', 'enrollment'],
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with number ${certificateNumber} not found`);
        }
        if (!certificate.isActive) {
            throw new common_1.BadRequestException('Certificate is inactive');
        }
        if (certificate.expiryDate && new Date() > certificate.expiryDate) {
            throw new common_1.BadRequestException('Certificate has expired');
        }
        return certificate;
    }
    async getCertificateWithStudentId(certificateNumber) {
        const certificate = await this.certificateRepository.findOne({
            where: { certificateNumber },
            relations: ['student', 'course', 'enrollment'],
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with number ${certificateNumber} not found`);
        }
        return {
            certificate,
            studentId: certificate.student.studentId || 'N/A',
            studentName: certificate.studentName,
            courseName: certificate.courseName,
            completionPercentage: certificate.completionPercentage,
            issuedDate: certificate.issuedDate,
            certificateNumber: certificate.certificateNumber,
        };
    }
    async getUserCertificateStats(userId) {
        const totalCertificates = await this.certificateRepository.count({
            where: { student: { id: userId } },
        });
        const activeCertificates = await this.certificateRepository.count({
            where: {
                student: { id: userId },
                isActive: true
            },
        });
        const expiredCertificates = await this.certificateRepository.count({
            where: {
                student: { id: userId },
                isActive: true,
                expiryDate: new Date(),
            },
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCertificates = await this.certificateRepository.count({
            where: {
                student: { id: userId },
                issuedDate: thirtyDaysAgo,
            },
        });
        return {
            totalCertificates,
            activeCertificates,
            expiredCertificates,
            recentCertificates,
        };
    }
    generateCertificateNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `CERT-${timestamp}-${random}`;
    }
    async getCertificateStats() {
        const totalCertificates = await this.certificateRepository.count();
        const activeCertificates = await this.certificateRepository.count({
            where: { isActive: true },
        });
        const expiredCertificates = await this.certificateRepository.count({
            where: {
                isActive: true,
                expiryDate: new Date(),
            },
        });
        return {
            totalCertificates,
            activeCertificates,
            expiredCertificates,
        };
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map