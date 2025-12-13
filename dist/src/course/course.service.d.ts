import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Category } from '../categoris/entities/categoris.entity';
import { Admin } from '../admin/entities/admin.entity';
export declare class CourseService {
    private courseRepository;
    private categoryRepository;
    private adminRepository;
    constructor(courseRepository: Repository<Course>, categoryRepository: Repository<Category>, adminRepository: Repository<Admin>);
    create(createCourseDto: CreateCourseDto): Promise<Course>;
    findAll(): Promise<Course[]>;
    findOne(id: number): Promise<Course>;
    update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: number): Promise<void>;
    findByCategory(categoryId: number): Promise<Course[]>;
    findByInstructor(instructorId: number): Promise<Course[]>;
    enrollStudent(courseId: number, studentId: number): Promise<Course>;
    getCourseStatistics(): Promise<any>;
}
