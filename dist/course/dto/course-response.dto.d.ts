import { Technology, Assignment } from './shared-types';
export declare class CourseResponseDto {
    id: number;
    name: string;
    description: string;
    slugName: string;
    duration: string;
    price: number;
    discountPrice?: number;
    totalJoin: number;
    totalSeat: number;
    whatYouWillLearn: string[];
    technologies: Technology[];
    requirements: string[];
    promoVideoUrl?: string;
    courseVideosUrl?: string[];
    thumbnail?: string;
    facebookGroupLink?: string;
    assignments?: Assignment[];
    isActive: boolean;
    isPublished: boolean;
    isFeatured: boolean;
    category: {
        id: number;
        name: string;
    };
    instructor: {
        id: number;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare class CourseListResponseDto {
    success: boolean;
    data: CourseResponseDto[];
    count: number;
}
export declare class CourseSingleResponseDto {
    success: boolean;
    message: string;
    data: CourseResponseDto;
}
export declare class CourseErrorResponseDto {
    success: boolean;
    message: string;
    error?: any;
}
