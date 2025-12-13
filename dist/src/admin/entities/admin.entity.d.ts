export declare enum JobType {
    PERMANENT = "permanent",
    CONTRACTUAL = "contractual",
    PROJECT_BASED = "project_based"
}
export declare enum AdminRole {
    MODERATOR = "moderator",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class Admin {
    id: number;
    name: string;
    email: string;
    bio: string;
    designation: string;
    experience: number;
    fbLink: string;
    linkedinLink: string;
    instaLink: string;
    expertise: string[];
    salary: number;
    jobType: JobType;
    photoUrl: string;
    role: AdminRole;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
