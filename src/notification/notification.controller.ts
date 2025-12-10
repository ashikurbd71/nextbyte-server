import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, CreateBulkNotificationDto, CreateCourseNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { NotificationType } from './entities/notification.entity';

@Controller('notifications')
// @UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }



  @Get('student/:id')
  findStudentNotifications(@Param('id', ParseIntPipe) studentId: number) {
    return this.notificationService.findByUser(studentId);
  }

  @Get('student/unread-count/:id')
  getStudentUnreadCount(@Param('id', ParseIntPipe) studentId: number) {
    return this.notificationService.getUnreadCount(studentId);
  }

  @Get('type/:type')
  findByType(@Param('type') type: NotificationType) {
    return this.notificationService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Patch('student/:id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('student/mark-all-read/:id')
  markAllAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAllAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }

  // Specific notification creation endpoints
  @Post('assignment-feedback')
  createAssignmentFeedbackNotification(@Body() data: {
    studentId: number;
    assignmentTitle: string;
    marks: number;
    feedback: string;
    courseName: string;
  }) {
    return this.notificationService.createAssignmentFeedbackNotification(
      data.studentId,
      data.assignmentTitle,
      data.marks,
      data.feedback,
      data.courseName
    );
  }

  @Post('assignment-submitted')
  createAssignmentSubmittedNotification(@Body() data: {
    studentId: number;
    assignmentTitle: string;
    moduleName: string;
  }) {
    return this.notificationService.createAssignmentSubmittedNotification(
      data.studentId,
      data.assignmentTitle,
      data.moduleName
    );
  }

  @Post('course-enrollment')
  createCourseEnrollmentNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
  }) {
    return this.notificationService.createCourseEnrollmentNotification(
      data.studentId,
      data.courseName,
      data.amount
    );
  }

  @Post('course-completed')
  createCourseCompletedNotification(@Body() data: {
    studentId: number;
    courseName: string;
  }) {
    return this.notificationService.createCourseCompletedNotification(
      data.studentId,
      data.courseName
    );
  }

  @Post('payment-success')
  createPaymentSuccessNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
    transactionId: string;
  }) {
    return this.notificationService.createPaymentSuccessNotification(
      data.studentId,
      data.courseName,
      data.amount,
      data.transactionId
    );
  }

  @Post('payment-failed')
  createPaymentFailedNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
    reason: string;
  }) {
    return this.notificationService.createPaymentFailedNotification(
      data.studentId,
      data.courseName,
      data.amount,
      data.reason
    );
  }

  @Post('new-module-upload')
  createNewModuleUploadNotification(@Body() data: {
    studentId: number;
    moduleName: string;
    courseName: string;
  }) {
    return this.notificationService.createNewModuleUploadNotification(
      data.studentId,
      data.moduleName,
      data.courseName
    );
  }

  @Post('general')
  createGeneralNotification(@Body() data: {
    studentId: number;
    title: string;
    message: string;
    metadata?: any;
  }) {
    return this.notificationService.createGeneralNotification(
      data.studentId,
      data.title,
      data.message,
      data.metadata
    );
  }

  // New endpoint to send notification to all users
  @Post('send-to-all-users')
  createNotificationForAllUsers(@Body() createBulkNotificationDto: CreateBulkNotificationDto) {
    return this.notificationService.createNotificationForAllUsers(
      createBulkNotificationDto.title,
      createBulkNotificationDto.message,
      createBulkNotificationDto.metadata
    );
  }

  /**
* Send notification to all students enrolled in a specific course
* @param courseId - The ID of the course
* @param createCourseNotificationDto - Notification data including title, message, link, and description
* @returns Object with success status, total students, emails sent, and any errors
* 
* Example request body:
* {
*   "title": "New Module Available",
*   "message": "A new module has been added to your course",
*   "link": "https://example.com/module",
*   "description": "This module covers advanced topics in the course"
* }
*/
  @Post('send-to-course-students/:courseId')
  sendNotificationsToCourseStudents(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createCourseNotificationDto: CreateCourseNotificationDto
  ) {
    // Add detailed debugging to see what's being received
    console.log('Raw request body:', createCourseNotificationDto);
    console.log('Received bulk notification data:', {
      courseId,
      title: createCourseNotificationDto.title,
      message: createCourseNotificationDto.message,
      link: createCourseNotificationDto.link,
      description: createCourseNotificationDto.description
    });

    // Check if message might be in a different field, use description as fallback
    const message = createCourseNotificationDto.message ||
      createCourseNotificationDto.content ||
      createCourseNotificationDto.body ||
      createCourseNotificationDto.text ||
      createCourseNotificationDto.description ||
      'No message provided';

    console.log('Extracted message:', message);

    // Validate required fields at controller level
    if (!createCourseNotificationDto.title) {
      return {
        success: false,
        totalStudents: 0,
        emailsSent: 0,
        errors: ['Title is required']
      };
    }

    const metadata = {
      ...createCourseNotificationDto.metadata,
      link: createCourseNotificationDto.link,
      description: createCourseNotificationDto.description,
      originalMessage: createCourseNotificationDto.message // Keep original message if it exists
    };

    return this.notificationService.sendNotificationsToCourseStudents(
      courseId,
      createCourseNotificationDto.title,
      message,
      metadata
    );
  }

  /**
   * Send notification to a specific student enrolled in a course
   * @param courseId - The ID of the course
   * @param studentId - The ID of the student
   * @param createCourseNotificationDto - Notification data including title, message, link, and description
   * @returns Object with success status, email sent status, and any error
   * 
   * Example request body:
   * {
   *   "title": "Personal Feedback Available",
   *   "message": "Your assignment has been reviewed with detailed feedback",
   *   "link": "https://example.com/assignment/123",
   *   "description": "Please review the feedback and resubmit if needed"
   * }
   */
  @Post('send-to-course-student/:courseId/:studentId')
  sendNotificationToCourseStudent(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() createCourseNotificationDto: CreateCourseNotificationDto
  ) {
    // Add detailed debugging to see what's being received
    console.log('Raw request body:', createCourseNotificationDto);
    console.log('Received notification data:', {
      courseId,
      studentId,
      title: createCourseNotificationDto.title,
      message: createCourseNotificationDto.message,
      link: createCourseNotificationDto.link,
      description: createCourseNotificationDto.description
    });

    // Check if message might be in a different field, use description as fallback
    const message = createCourseNotificationDto.message ||
      createCourseNotificationDto.content ||
      createCourseNotificationDto.body ||
      createCourseNotificationDto.text ||
      createCourseNotificationDto.description ||
      'No message provided';

    console.log('Extracted message:', message);

    // Validate required fields at controller level
    if (!createCourseNotificationDto.title) {
      return {
        success: false,
        emailSent: false,
        error: 'Title is required'
      };
    }

    const metadata = {
      ...createCourseNotificationDto.metadata,
      link: createCourseNotificationDto.link,
      description: createCourseNotificationDto.description,
      originalMessage: createCourseNotificationDto.message // Keep original message if it exists
    };

    return this.notificationService.sendNotificationToCourseStudent(
      courseId,
      studentId,
      createCourseNotificationDto.title,
      message,
      metadata
    );
  }
}
