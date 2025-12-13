import { TicketStatus } from '../entities/tickte.entity';
export declare class TicketResponseDto {
    id: string;
    serialNumber: number;
    title: string;
    description: string;
    status: TicketStatus;
    userId: number;
    mentorId?: number;
    meetLink?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    mentor?: {
        id: number;
        name: string;
        email: string;
    };
}
