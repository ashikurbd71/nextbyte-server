import { User } from '../../users/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';
export declare enum TicketStatus {
    OPEN = "open",
    ASSIGNED = "assigned",
    CLOSED = "closed"
}
export declare class Ticket {
    id: string;
    serialNumber: number;
    title: string;
    description: string;
    status: TicketStatus;
    userId: number;
    mentorId: number;
    meetLink: string;
    user: User;
    mentor: Admin;
    createdAt: Date;
    updatedAt: Date;
}
