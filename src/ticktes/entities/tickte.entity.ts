import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';

export enum TicketStatus {
    OPEN = 'open',
    ASSIGNED = 'assigned',
    CLOSED = 'closed'
}

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    serialNumber: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status: TicketStatus;

    @Column()
    userId: number;

    @Column({ nullable: true })
    mentorId: number;

    @Column({ nullable: true })
    meetLink: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Admin, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'mentorId' })
    mentor: Admin;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
