import { JobType, AdminRole } from '../entities/admin.entity';
export declare class CreateAdminDto {
    name: string;
    email: string;
    bio?: string;
    designation?: string;
    experience?: number;
    fbLink?: string;
    linkedinLink?: string;
    instaLink?: string;
    expertise?: string[];
    salary?: number;
    jobType?: JobType;
    photoUrl?: string;
    role?: AdminRole;
    password: string;
}
