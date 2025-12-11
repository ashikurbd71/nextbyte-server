import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    create(createCertificateDto: CreateCertificateDto): Promise<import("./entities/certificate.entity").Certificate>;
    findAll(): Promise<import("./entities/certificate.entity").Certificate[]>;
    getStats(): Promise<{
        totalCertificates: number;
        activeCertificates: number;
        expiredCertificates: number;
    }>;
    getMyCertificates(id: string, isActive?: string, sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage', sortOrder?: 'ASC' | 'DESC', limit?: string, offset?: string): Promise<import("./entities/certificate.entity").Certificate[]>;
    getMyCertificateStats(id: string): Promise<{
        totalCertificates: number;
        activeCertificates: number;
        expiredCertificates: number;
        recentCertificates: number;
    }>;
    findByCourse(courseId: string): Promise<import("./entities/certificate.entity").Certificate[]>;
    verifyCertificate(certificateNumber: string): Promise<import("./entities/certificate.entity").Certificate>;
    getCertificateWithStudentId(certificateNumber: string): Promise<{
        certificate: import("./entities/certificate.entity").Certificate;
        studentId: string;
        studentName: string;
        courseName: string;
        completionPercentage: number;
        issuedDate: Date;
        certificateNumber: string;
    }>;
    findOne(id: string): Promise<import("./entities/certificate.entity").Certificate>;
    generateCertificate(generateCertificateDto: GenerateCertificateDto): Promise<import("./entities/certificate.entity").Certificate>;
    generateCertificateForCompletedCourse(enrollmentId: string): Promise<import("./entities/certificate.entity").Certificate>;
    update(id: string, updateCertificateDto: UpdateCertificateDto): Promise<import("./entities/certificate.entity").Certificate>;
    remove(id: string): Promise<void>;
}
