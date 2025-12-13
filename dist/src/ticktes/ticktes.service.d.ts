import { Repository } from 'typeorm';
import { Ticket } from './entities/tickte.entity';
import { CreateTicketDto } from './dto/create-tickte.dto';
import { UpdateTicketDto } from './dto/update-tickte.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { EmailService } from '../admin/email.service';
import { Admin } from '../admin/entities/admin.entity';
import { User } from '../users/entities/user.entity';
export declare class TicktesService {
    private ticketRepository;
    private adminRepository;
    private userRepository;
    private emailService;
    constructor(ticketRepository: Repository<Ticket>, adminRepository: Repository<Admin>, userRepository: Repository<User>, emailService: EmailService);
    create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto>;
    findAll(): Promise<TicketResponseDto[]>;
    findByUserId(userId: number): Promise<TicketResponseDto[]>;
    findOne(id: string): Promise<TicketResponseDto>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto>;
    assignTicket(id: string, assignTicketDto: AssignTicketDto): Promise<TicketResponseDto>;
    closeTicket(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    private mapToResponseDto;
}
