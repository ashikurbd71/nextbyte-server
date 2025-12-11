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
exports.CategorisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoris_entity_1 = require("./entities/categoris.entity");
let CategorisService = class CategorisService {
    categorisRepository;
    constructor(categorisRepository) {
        this.categorisRepository = categorisRepository;
    }
    async create(createCategorisDto) {
        try {
            const existingCategory = await this.categorisRepository.findOne({
                where: { name: createCategorisDto.name },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
            const category = this.categorisRepository.create(createCategorisDto);
            const savedCategory = await this.categorisRepository.save(category);
            return {
                statusCode: 201,
                message: 'Category created successfully',
                data: savedCategory,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error('Failed to create category');
        }
    }
    async findAll() {
        try {
            const categories = await this.categorisRepository.find({
                order: { id: 'ASC' },
            });
            return {
                statusCode: 200,
                message: 'Categories retrieved successfully',
                data: categories,
                count: categories.length,
            };
        }
        catch (error) {
            throw new Error('Failed to retrieve categories');
        }
    }
    async findOne(id) {
        try {
            const category = await this.categorisRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            return {
                statusCode: 200,
                message: 'Category retrieved successfully',
                data: category,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to retrieve category');
        }
    }
    async update(id, updateCategorisDto) {
        try {
            const category = await this.categorisRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            const newName = updateCategorisDto.name;
            if (newName && newName !== category.name) {
                const existingCategory = await this.categorisRepository.findOne({
                    where: { name: newName },
                });
                if (existingCategory) {
                    throw new common_1.ConflictException('Category with this name already exists');
                }
            }
            await this.categorisRepository.update(id, updateCategorisDto);
            const updatedCategory = await this.categorisRepository.findOne({
                where: { id },
            });
            return {
                statusCode: 200,
                message: 'Category updated successfully',
                data: updatedCategory,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error('Failed to update category');
        }
    }
    async remove(id) {
        try {
            const category = await this.categorisRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            await this.categorisRepository.remove(category);
            return {
                statusCode: 200,
                message: 'Category deleted successfully',
                data: { id },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to delete category');
        }
    }
};
exports.CategorisService = CategorisService;
exports.CategorisService = CategorisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoris_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategorisService);
//# sourceMappingURL=categoris.service.js.map