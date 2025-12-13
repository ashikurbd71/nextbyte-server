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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lesson_entity_1 = require("./entities/lesson.entity");
const module_entity_1 = require("../module/entities/module.entity");
let LessonsService = class LessonsService {
    lessonRepository;
    moduleRepository;
    constructor(lessonRepository, moduleRepository) {
        this.lessonRepository = lessonRepository;
        this.moduleRepository = moduleRepository;
    }
    async create(createLessonDto) {
        const module = await this.moduleRepository.findOne({
            where: { id: createLessonDto.moduleId }
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module with ID ${createLessonDto.moduleId} not found`);
        }
        const lesson = this.lessonRepository.create({
            ...createLessonDto,
            module: module
        });
        return await this.lessonRepository.save(lesson);
    }
    async findAll() {
        return await this.lessonRepository.find({
            relations: ['module'],
            order: { order: 'ASC' }
        });
    }
    async findOne(id) {
        const lesson = await this.lessonRepository.findOne({
            where: { id },
            relations: ['module']
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async findByModule(moduleId) {
        return await this.lessonRepository.find({
            where: { module: { id: moduleId } },
            relations: ['module'],
            order: { order: 'ASC' }
        });
    }
    async update(id, updateLessonDto) {
        const lesson = await this.findOne(id);
        if (updateLessonDto.moduleId) {
            const module = await this.moduleRepository.findOne({
                where: { id: updateLessonDto.moduleId }
            });
            if (!module) {
                throw new common_1.NotFoundException(`Module with ID ${updateLessonDto.moduleId} not found`);
            }
            lesson.module = module;
        }
        Object.assign(lesson, updateLessonDto);
        return await this.lessonRepository.save(lesson);
    }
    async remove(id) {
        const lesson = await this.findOne(id);
        await this.lessonRepository.remove(lesson);
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __param(1, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map