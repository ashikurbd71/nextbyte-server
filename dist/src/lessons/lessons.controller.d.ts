import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(createLessonDto: CreateLessonDto): Promise<import("./entities/lesson.entity").Lesson>;
    findAll(): Promise<import("./entities/lesson.entity").Lesson[]>;
    findOne(id: number): Promise<import("./entities/lesson.entity").Lesson>;
    findByModule(moduleId: number): Promise<import("./entities/lesson.entity").Lesson[]>;
    update(id: number, updateLessonDto: UpdateLessonDto): Promise<import("./entities/lesson.entity").Lesson>;
    remove(id: number): Promise<void>;
}
