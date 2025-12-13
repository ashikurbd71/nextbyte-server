"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSubmissionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assignment_submissions_service_1 = require("./assignment-submissions.service");
const assignment_submissions_controller_1 = require("./assignment-submissions.controller");
const assignment_submission_entity_1 = require("./entities/assignment-submission.entity");
const user_entity_1 = require("../users/entities/user.entity");
const assignment_entity_1 = require("../assignment/entities/assignment.entity");
const notification_module_1 = require("../notification/notification.module");
let AssignmentSubmissionsModule = class AssignmentSubmissionsModule {
};
exports.AssignmentSubmissionsModule = AssignmentSubmissionsModule;
exports.AssignmentSubmissionsModule = AssignmentSubmissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([assignment_submission_entity_1.AssignmentSubmission, user_entity_1.User, assignment_entity_1.Assignment]),
            notification_module_1.NotificationModule
        ],
        controllers: [assignment_submissions_controller_1.AssignmentSubmissionsController],
        providers: [assignment_submissions_service_1.AssignmentSubmissionsService],
        exports: [assignment_submissions_service_1.AssignmentSubmissionsService],
    })
], AssignmentSubmissionsModule);
//# sourceMappingURL=assignment-submissions.module.js.map