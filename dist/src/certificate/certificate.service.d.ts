import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';
export declare class CertificateService {
    private certificateRepository;
    private enrollmentRepository;
    private userRepository;
    private courseRepository;
    constructor(certificateRepository: Repository<Certificate>, enrollmentRepository: Repository<Enrollment>, userRepository: Repository<User>, courseRepository: Repository<Course>);
    create(createCertificateDto: CreateCertificateDto): Promise<Certificate>;
    findAll(): Promise<Certificate[]>;
    findOne(id: number): Promise<Certificate>;
    findByStudent(studentId: number, options?: {
        isActive?: boolean;
        sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage';
        sortOrder?: 'ASC' | 'DESC';
        limit?: number;
        offset?: number;
    }): Promise<Certificate[]>;
    findByCourse(courseId: number): Promise<Certificate[]>;
    update(id: number, updateCertificateDto: UpdateCertificateDto): Promise<Certificate>;
    remove(id: number): Promise<void>;
    generateCertificate(generateCertificateDto: GenerateCertificateDto): Promise<Certificate>;
    generateCertificateForCompletedCourse(enrollmentId: number): Promise<Certificate>;
    verifyCertificate(certificateNumber: string): Promise<Certificate>;
    getCertificateWithStudentId(certificateNumber: string): Promise<{
        certificate: Certificate;
        studentId: string;
        studentName: string;
        courseName: string;
        completionPercentage: number;
        issuedDate: Date;
        certificateNumber: string;
    }>;
    getUserCertificateStats(userId: number): Promise<{
        totalCertificates: number;
        activeCertificates: number;
        expiredCertificates: number;
        recentCertificates: number;
    }>;
    private generateCertificateNumber;
    getCertificateStats(): Promise<{
        totalCertificates: number;
        activeCertificates: number;
        expiredCertificates: number;
    }>;
}
