import { TicktesService } from './ticktes.service';
import { CreateTicketDto } from './dto/create-tickte.dto';
import { UpdateTicketDto } from './dto/update-tickte.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
export declare class TicktesController {
    private readonly ticktesService;
    constructor(ticktesService: TicktesService);
    create(createTicketDto: CreateTicketDto, req: any): Promise<TicketResponseDto>;
    findAll(): Promise<TicketResponseDto[]>;
    findByUserId(userId: string): Promise<TicketResponseDto[]>;
    findOne(id: string): Promise<TicketResponseDto>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto>;
    assignTicket(id: string, assignTicketDto: AssignTicketDto): Promise<TicketResponseDto>;
    closeTicket(id: string): Promise<void>;
    remove(id: string): Promise<void>;
}
