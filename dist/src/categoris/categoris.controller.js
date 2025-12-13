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
exports.CategorisController = void 0;
const common_1 = require("@nestjs/common");
const categoris_service_1 = require("./categoris.service");
const create_categoris_dto_1 = require("./dto/create-categoris.dto");
const update_categoris_dto_1 = require("./dto/update-categoris.dto");
let CategorisController = class CategorisController {
    categorisService;
    constructor(categorisService) {
        this.categorisService = categorisService;
    }
    async create(createCategorisDto) {
        return await this.categorisService.create(createCategorisDto);
    }
    async findAll() {
        return await this.categorisService.findAll();
    }
    async findOne(id) {
        return await this.categorisService.findOne(id);
    }
    async update(id, updateCategorisDto) {
        return await this.categorisService.update(id, updateCategorisDto);
    }
    async remove(id) {
        return await this.categorisService.remove(id);
    }
};
exports.CategorisController = CategorisController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoris_dto_1.CreateCategorisDto]),
    __metadata("design:returntype", Promise)
], CategorisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategorisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategorisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_categoris_dto_1.UpdateCategorisDto]),
    __metadata("design:returntype", Promise)
], CategorisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategorisController.prototype, "remove", null);
exports.CategorisController = CategorisController = __decorate([
    (0, common_1.Controller)('categoris'),
    __metadata("design:paramtypes", [categoris_service_1.CategorisService])
], CategorisController);
//# sourceMappingURL=categoris.controller.js.map