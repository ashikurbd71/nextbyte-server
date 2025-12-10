import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Category } from '../categoris/entities/categoris.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Validate required fields
      if (!createCourseDto.name || !createCourseDto.slugName) {
        throw new BadRequestException('Course name and slug name are required');
      }

      // Check if course with same slug already exists
      const existingCourse = await this.courseRepository.findOne({
        where: { slugName: createCourseDto.slugName }
      });

      if (existingCourse) {
        throw new BadRequestException(`Course with slug name '${createCourseDto.slugName}' already exists`);
      }

      // Load the category and instructor entities
      const category = await this.categoryRepository.findOne({
        where: { id: createCourseDto.categoryId }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${createCourseDto.categoryId} not found`);
      }

      const instructors = await this.adminRepository.find({
        where: { id: In(createCourseDto.instructorIds) }
      });

      if (instructors.length === 0) {
        throw new NotFoundException(`No instructors found with the provided IDs: ${createCourseDto.instructorIds.join(', ')}`);
      }

      // Validate price and discount price
      if (createCourseDto.discountPrice && createCourseDto.discountPrice >= createCourseDto.price) {
        throw new BadRequestException('Discount price must be less than regular price');
      }

      // Create course object with proper relationships
      const { categoryId, instructorIds, ...courseData } = createCourseDto;
      const course = this.courseRepository.create({
        ...courseData,
        category,
        instructors: instructors,
        totalJoin: 0,
        isActive: createCourseDto.isActive ?? true,
        isPublished: createCourseDto.isPublished ?? false,
      });

      return await this.courseRepository.save(course);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create course: ' + error.message);
    }
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user']
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Handle category update if provided
    if (updateCourseDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateCourseDto.categoryId }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${updateCourseDto.categoryId} not found`);
      }

      course.category = category;
    }

    // Handle instructor update if provided
    if (updateCourseDto.instructorIds) {
      const instructors = await this.adminRepository.find({
        where: { id: In(updateCourseDto.instructorIds) }
      });

      if (instructors.length === 0) {
        throw new NotFoundException(`No instructors found with the provided IDs: ${updateCourseDto.instructorIds.join(', ')}`);
      }

      // Initialize instructors array if it doesn't exist
      if (!course.instructors) {
        course.instructors = [];
      }

      // Replace all instructors with the new ones
      course.instructors = instructors;
    }

    // Remove the ID fields as they're not part of the Course entity
    const { categoryId, instructorIds, ...updateData } = updateCourseDto;

    // Update other fields
    Object.assign(course, updateData);

    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  async findByCategory(categoryId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments', 'reviews.user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByInstructor(instructorId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { instructors: { id: instructorId } },
      relations: ['category', 'instructors', 'students', 'modules', 'reviews', 'reviews.user'],
      order: { createdAt: 'DESC' }
    });
  }

  async enrollStudent(courseId: number, studentId: number): Promise<Course> {
    const course = await this.findOne(courseId);
    course.students = course.students || [];
    course.students.push({ id: studentId } as any);
    course.totalJoin += 1;
    return await this.courseRepository.save(course);
  }

  async getCourseStatistics(): Promise<any> {
    const totalCourses = await this.courseRepository.count();
    const publishedCourses = await this.courseRepository.count({
      where: { isPublished: true }
    });
    const activeCourses = await this.courseRepository.count({
      where: { isActive: true }
    });

    const totalEnrollments = await this.courseRepository
      .createQueryBuilder('course')
      .select('SUM(course.totalJoin)', 'total')
      .getRawOne();

    return {
      totalCourses,
      publishedCourses,
      activeCourses,
      totalEnrollments: totalEnrollments?.total || 0,
      averageEnrollments: totalCourses > 0 ? (totalEnrollments?.total || 0) / totalCourses : 0
    };
  }
}
