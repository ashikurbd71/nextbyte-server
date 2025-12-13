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
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const certificate_service_1 = require("./certificate.service");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const update_certificate_dto_1 = require("./dto/update-certificate.dto");
const generate_certificate_dto_1 = require("./dto/generate-certificate.dto");
let CertificateController = class CertificateController {
    certificateService;
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    create(createCertificateDto) {
        return this.certificateService.create(createCertificateDto);
    }
    findAll() {
        return this.certificateService.findAll();
    }
    getStats() {
        return this.certificateService.getCertificateStats();
    }
    getMyCertificates(id, isActive, sortBy, sortOrder, limit, offset) {
        const userId = +id;
        const options = {
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            sortBy,
            sortOrder,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        };
        return this.certificateService.findByStudent(userId, options);
    }
    getMyCertificateStats(id) {
        const userId = +id;
        return this.certificateService.getUserCertificateStats(userId);
    }
    findByCourse(courseId) {
        return this.certificateService.findByCourse(+courseId);
    }
    verifyCertificate(certificateNumber) {
        return this.certificateService.verifyCertificate(certificateNumber);
    }
    getCertificateWithStudentId(certificateNumber) {
        return this.certificateService.getCertificateWithStudentId(certificateNumber);
    }
    findOne(id) {
        return this.certificateService.findOne(+id);
    }
    generateCertificate(generateCertificateDto) {
        return this.certificateService.generateCertificate(generateCertificateDto);
    }
    generateCertificateForCompletedCourse(enrollmentId) {
        return this.certificateService.generateCertificateForCompletedCourse(+enrollmentId);
    }
    update(id, updateCertificateDto) {
        return this.certificateService.update(+id, updateCertificateDto);
    }
    remove(id) {
        return this.certificateService.remove(+id);
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certificate_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('student/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "getMyCertificates", null);
__decorate([
    (0, common_1.Get)('student/stats/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "getMyCertificateStats", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findByCourse", null);
__decorate([
    (0, common_1.Get)('verify/:certificateNumber'),
    __param(0, (0, common_1.Param)('certificateNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "verifyCertificate", null);
__decorate([
    (0, common_1.Get)('details/:certificateNumber'),
    __param(0, (0, common_1.Param)('certificateNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "getCertificateWithStudentId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_certificate_dto_1.GenerateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "generateCertificate", null);
__decorate([
    (0, common_1.Post)('generate/:enrollmentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "generateCertificateForCompletedCourse", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_certificate_dto_1.UpdateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "remove", null);
exports.CertificateController = CertificateController = __decorate([
    (0, common_1.Controller)('certificate'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map