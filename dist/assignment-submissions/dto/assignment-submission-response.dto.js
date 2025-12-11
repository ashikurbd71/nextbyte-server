"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPerformanceResponseDto = exports.AssignmentSubmissionListResponseDto = exports.AssignmentSubmissionResponseDto = void 0;
class AssignmentSubmissionResponseDto {
    id;
    description;
    githubLink;
    liveLink;
    fileUrl;
    marks;
    feedback;
    status;
    reviewedAt;
    studentId;
    studentName;
    studentEmail;
    studentPhone;
    assignmentId;
    assignmentTitle;
    moduleTitle;
    createdAt;
    updatedAt;
}
exports.AssignmentSubmissionResponseDto = AssignmentSubmissionResponseDto;
class AssignmentSubmissionListResponseDto {
    id;
    assignmentTitle;
    moduleTitle;
    studentName;
    status;
    marks;
    submittedAt;
    reviewedAt;
}
exports.AssignmentSubmissionListResponseDto = AssignmentSubmissionListResponseDto;
class StudentPerformanceResponseDto {
    totalSubmissions;
    totalMarks;
    averageMarks;
    statusCounts;
    submissions;
}
exports.StudentPerformanceResponseDto = StudentPerformanceResponseDto;
//# sourceMappingURL=assignment-submission-response.dto.js.map