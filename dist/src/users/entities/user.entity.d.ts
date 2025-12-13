export declare class User {
    id: number;
    name: string;
    email: string;
    phone: string;
    studentId: string;
    photoUrl: string;
    address: string;
    age: number;
    instituteName: string;
    semester: string;
    subject: string;
    isVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    banReason: string | null;
    bannedAt: Date | null;
    lastOtp: string | null;
    otpExpiry: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
