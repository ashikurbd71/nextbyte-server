import { Technology, Assignment } from './shared-types';
export declare class CreateCourseDto {
    name: string;
    description: string;
    slugName: string;
    duration: string;
    price: number;
    discountPrice?: number;
    totalSeat?: number;
    whatYouWillLearn: string[];
    technologies: Technology[];
    requirements: string[];
    promoVideoUrl?: string;
    courseVideosUrl?: string[];
    thumbnail?: string;
    facebookGroupLink?: string;
    assignments?: Assignment[];
    totalModules?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    isPublished?: boolean;
    categoryId: number;
    instructorIds: number[];
}
