import { Technology, Assignment } from './shared-types';
export declare class UpdateCourseDto {
    name?: string;
    description?: string;
    slugName?: string;
    duration?: string;
    price?: number;
    discountPrice?: number;
    totalSeat?: number;
    whatYouWillLearn?: string[];
    technologies?: Technology[];
    requirements?: string[];
    promoVideoUrl?: string;
    courseVideosUrl?: string[];
    thumbnail?: string;
    facebookGroupLink?: string;
    assignments?: Assignment[];
    isActive?: boolean;
    isPublished?: boolean;
    categoryId?: number;
    instructorIds?: number[];
    isFeatured?: boolean;
    totalModules?: number;
}
