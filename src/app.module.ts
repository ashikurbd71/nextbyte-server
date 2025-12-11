import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CategorisModule } from './categoris/categoris.module';
import { CourseModule } from './course/course.module';
import { ModuleModule } from './module/module.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ReviewModule } from './review/review.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

import { LessonsModule } from './lessons/lessons.module';
import { AssignmentSubmissionsModule } from './assignment-submissions/assignment-submissions.module';
import { NotificationModule } from './notification/notification.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CertificateModule } from './certificate/certificate.module';
import { TicktesModule } from './ticktes/ticktes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://neondb_owner:npg_8vpbxwXlhkM0@ep-divine-breeze-a1ozmpn4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
    }),

    UsersModule,
    AdminModule,
    CategorisModule,
    CourseModule,
    ModuleModule,
    AssignmentModule,
    ReviewModule,
    EnrollmentModule,
    LessonsModule,
    // AssignmentSubmissionsModule,
    // NotificationModule,
    // StatisticsModule,
    // CertificateModule,
    // TicktesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
