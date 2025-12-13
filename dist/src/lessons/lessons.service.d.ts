import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { Module } from '../module/entities/module.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private lessonRepository;
    private moduleRepository;
    constructor(lessonRepository: Repository<Lesson>, moduleRepository: Repository<Module>);
    create(createLessonDto: CreateLessonDto): Promise<Lesson>;
    findAll(): Promise<Lesson[]>;
    findOne(id: number): Promise<Lesson>;
    findByModule(moduleId: number): Promise<Lesson[]>;
    update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson>;
    remove(id: number): Promise<void>;
}
