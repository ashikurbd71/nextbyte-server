"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const categoris_module_1 = require("./categoris/categoris.module");
const course_module_1 = require("./course/course.module");
const module_module_1 = require("./module/module.module");
const assignment_module_1 = require("./assignment/assignment.module");
const review_module_1 = require("./review/review.module");
const enrollment_module_1 = require("./enrollment/enrollment.module");
const lessons_module_1 = require("./lessons/lessons.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL ||
                    'postgresql://neondb_owner:npg_8vpbxwXlhkM0@ep-divine-breeze-a1ozmpn4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
                synchronize: true,
                logging: true,
                ssl: {
                    rejectUnauthorized: false,
                },
                autoLoadEntities: true,
            }),
            users_module_1.UsersModule,
            categoris_module_1.CategorisModule,
            course_module_1.CourseModule,
            module_module_1.ModuleModule,
            assignment_module_1.AssignmentModule,
            review_module_1.ReviewModule,
            enrollment_module_1.EnrollmentModule,
            lessons_module_1.LessonsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map