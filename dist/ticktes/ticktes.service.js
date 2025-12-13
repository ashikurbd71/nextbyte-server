"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicktesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tickte_entity_1 = require("./entities/tickte.entity");
const email_service_1 = require("../admin/email.service");
const admin_entity_1 = require("../admin/entities/admin.entity");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_3 = require("typeorm");
let TicktesService = class TicktesService {
    ticketRepository;
    adminRepository;
    userRepository;
    emailService;
    constructor(ticketRepository, adminRepository, userRepository, emailService) {
        this.ticketRepository = ticketRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    async create(createTicketDto) {
        const user = await this.userRepository.findOne({
            where: { id: createTicketDto.userId }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createTicketDto.userId} not found`);
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('User account is not active');
        }
        if (user.isBanned) {
            throw new common_1.BadRequestException('User account is banned');
        }
        const recentTickets = await this.ticketRepository.count({
            where: {
                userId: user.id,
                createdAt: (0, typeorm_3.MoreThan)(new Date(Date.now() - 24 * 60 * 60 * 1000))
            }
        });
        if (recentTickets >= 5) {
            throw new common_1.BadRequestException('You have reached the daily limit for ticket creation');
        }
        const lastTickets = await this.ticketRepository.find({
            order: { serialNumber: 'DESC' },
            take: 1,
        });
        const nextSerialNumber = lastTickets.length > 0 ? lastTickets[0].serialNumber + 1 : 1;
        const ticket = this.ticketRepository.create({
            ...createTicketDto,
            serialNumber: nextSerialNumber,
            status: tickte_entity_1.TicketStatus.OPEN,
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        try {
            await this.emailService.sendGeneralNotificationEmail('ashikurovi2003@gmail.com', 'Admin', `New Support Ticket Created - #${savedTicket.serialNumber}`, `
          <p>A new support ticket has been created by a student. Please review the details below:</p>

                     <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
             <h3 style="margin-top: 0; color: #555;">Ticket Details</h3>
             <p><strong>Ticket Number:</strong> #${savedTicket.serialNumber}</p>
             <p><strong>Title:</strong> ${savedTicket.title}</p>
             <p><strong>Description:</strong> ${savedTicket.description}</p>
             <p><strong>Student Name:</strong> ${user.name}</p>
             <p><strong>Student Email:</strong> ${user.email}</p>
             <p><strong>Created At:</strong> ${savedTicket.createdAt.toLocaleString()}</p>
           </div>

           <p>Please assign this ticket to an appropriate mentor or handle it directly. The mentor can add a meeting link when assigning the ticket.</p>
        `);
        }
        catch (error) {
            console.error('Failed to send admin notification email:', error);
        }
        return this.mapToResponseDto(savedTicket);
    }
    async findAll() {
        const tickets = await this.ticketRepository.find({
            relations: ['user', 'mentor'],
            order: { createdAt: 'DESC' },
        });
        return tickets.map(ticket => this.mapToResponseDto(ticket));
    }
    async findByUserId(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const tickets = await this.ticketRepository.find({
            where: { userId },
            relations: ['user', 'mentor'],
            order: { createdAt: 'DESC' },
        });
        return tickets.map(ticket => this.mapToResponseDto(ticket));
    }
    async findOne(id) {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['user', 'mentor'],
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        return this.mapToResponseDto(ticket);
    }
    async update(id, updateTicketDto) {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        Object.assign(ticket, updateTicketDto);
        const updatedTicket = await this.ticketRepository.save(ticket);
        return this.mapToResponseDto(updatedTicket);
    }
    async assignTicket(id, assignTicketDto) {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['user', 'mentor']
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        if (ticket.status === tickte_entity_1.TicketStatus.CLOSED) {
            throw new common_1.BadRequestException('Cannot assign a closed ticket');
        }
        const mentor = await this.adminRepository.findOne({
            where: { id: assignTicketDto.mentorId },
        });
        if (!mentor) {
            throw new common_1.NotFoundException(`Mentor with ID ${assignTicketDto.mentorId} not found`);
        }
        ticket.mentorId = assignTicketDto.mentorId;
        ticket.status = tickte_entity_1.TicketStatus.ASSIGNED;
        if (assignTicketDto.meetLink) {
            ticket.meetLink = assignTicketDto.meetLink;
        }
        const updatedTicket = await this.ticketRepository.save(ticket);
        try {
            await this.emailService.sendGeneralNotificationEmail(mentor.email, mentor.name, `New Ticket Assignment - #${ticket.serialNumber}`, `
          <p>You have been assigned a new support ticket. Please review the details below:</p>

                     <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
             <h3 style="margin-top: 0; color: #555;">Ticket Details</h3>
             <p><strong>Ticket Number:</strong> #${ticket.serialNumber}</p>
             <p><strong>Title:</strong> ${ticket.title}</p>
             <p><strong>Description:</strong> ${ticket.description}</p>
             <p><strong>Student Name:</strong> ${ticket.user?.name || 'N/A'}</p>
             <p><strong>Student Email:</strong> ${ticket.user?.email || 'N/A'}</p>
             ${ticket.meetLink ? `<p><strong>Meeting Link:</strong> <a href="${ticket.meetLink}" style="color: #007bff;">${ticket.meetLink}</a></p>` : ''}
           </div>

           <p>Please contact the student to provide support.${ticket.meetLink ? ' You can use the meeting link above for the session.' : ''}</p>
        `);
        }
        catch (error) {
            console.error('Failed to send mentor email notification:', error);
        }
        if (ticket.user) {
            try {
                await this.emailService.sendGeneralNotificationEmail(ticket.user.email, ticket.user.name, `Your Ticket Has Been Assigned - #${ticket.serialNumber}`, `
            <p>Great news! Your support ticket has been assigned to a mentor. Here are the details:</p>

                         <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
               <h3 style="margin-top: 0; color: #555;">Ticket Details</h3>
               <p><strong>Ticket Number:</strong> #${ticket.serialNumber}</p>
               <p><strong>Title:</strong> ${ticket.title}</p>
               <p><strong>Description:</strong> ${ticket.description}</p>
               <p><strong>Assigned Mentor:</strong> ${mentor.name}</p>
               <p><strong>Mentor Email:</strong> ${mentor.email}</p>
               ${ticket.meetLink ? `<p><strong>Meeting Link:</strong> <a href="${ticket.meetLink}" style="color: #007bff;">${ticket.meetLink}</a></p>` : ''}
             </div>

             <p>Your mentor will contact you soon.${ticket.meetLink ? ' You can join the meeting using the link above.' : ' Please be ready for the meeting.'}</p>
          `);
            }
            catch (error) {
                console.error('Failed to send student email notification:', error);
            }
        }
        return this.mapToResponseDto(updatedTicket);
    }
    async closeTicket(id) {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        if (ticket.status === tickte_entity_1.TicketStatus.CLOSED) {
            throw new common_1.BadRequestException('Ticket is already closed');
        }
        ticket.status = tickte_entity_1.TicketStatus.CLOSED;
        await this.ticketRepository.save(ticket);
        await this.ticketRepository.remove(ticket);
    }
    async remove(id) {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        await this.ticketRepository.remove(ticket);
    }
    mapToResponseDto(ticket) {
        return {
            id: ticket.id,
            serialNumber: ticket.serialNumber,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            userId: ticket.userId,
            mentorId: ticket.mentorId,
            meetLink: ticket.meetLink,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            user: ticket.user ? {
                id: ticket.user.id,
                name: ticket.user.name,
                email: ticket.user.email,
            } : undefined,
            mentor: ticket.mentor ? {
                id: ticket.mentor.id,
                name: ticket.mentor.name,
                email: ticket.mentor.email,
            } : undefined,
        };
    }
};
exports.TicktesService = TicktesService;
exports.TicktesService = TicktesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tickte_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], TicktesService);
//# sourceMappingURL=ticktes.service.js.map