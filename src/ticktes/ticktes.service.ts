import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/tickte.entity';
import { CreateTicketDto } from './dto/create-tickte.dto';
import { UpdateTicketDto } from './dto/update-tickte.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { EmailService } from '../admin/email.service';
import { Admin } from '../admin/entities/admin.entity';
import { User } from '../users/entities/user.entity';
import { MoreThan } from 'typeorm';

@Injectable()
export class TicktesService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) { }

  async create(createTicketDto: CreateTicketDto,): Promise<TicketResponseDto> {
    // Validate that the user exists and is active
    const user = await this.userRepository.findOne({
      where: { id: createTicketDto.userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createTicketDto.userId} not found`);
    }

    if (!user.isActive) {
      throw new BadRequestException('User account is not active');
    }

    if (user.isBanned) {
      throw new BadRequestException('User account is banned');
    }

    // Check if user has created too many tickets recently
    const recentTickets = await this.ticketRepository.count({
      where: {
        userId: user.id,
        createdAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
      }
    });

    if (recentTickets >= 5) { // Limit to 5 tickets per day
      throw new BadRequestException('You have reached the daily limit for ticket creation');
    }

    // Get the next serial number
    const lastTickets = await this.ticketRepository.find({
      order: { serialNumber: 'DESC' },
      take: 1,
    });
    const nextSerialNumber = lastTickets.length > 0 ? lastTickets[0].serialNumber + 1 : 1;

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      serialNumber: nextSerialNumber,
      status: TicketStatus.OPEN,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Send email notification to admin
    try {
      await this.emailService.sendGeneralNotificationEmail(
        'ashikurovi2003@gmail.com',
        'Admin',
        `New Support Ticket Created - #${savedTicket.serialNumber}`,
        `
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
        `
      );
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Don't fail the operation if email fails
    }

    return this.mapToResponseDto(savedTicket);
  }

  async findAll(): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketRepository.find({
      relations: ['user', 'mentor'],
      order: { createdAt: 'DESC' },
    });
    return tickets.map(ticket => this.mapToResponseDto(ticket));
  }

  async findByUserId(userId: number): Promise<TicketResponseDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tickets = await this.ticketRepository.find({
      where: { userId },
      relations: ['user', 'mentor'],
      order: { createdAt: 'DESC' },
    });

    return tickets.map(ticket => this.mapToResponseDto(ticket));
  }

  async findOne(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['user', 'mentor'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return this.mapToResponseDto(ticket);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    Object.assign(ticket, updateTicketDto);
    const updatedTicket = await this.ticketRepository.save(ticket);
    return this.mapToResponseDto(updatedTicket);
  }

  async assignTicket(id: string, assignTicketDto: AssignTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['user', 'mentor']
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Cannot assign a closed ticket');
    }

    // Verify mentor exists
    const mentor = await this.adminRepository.findOne({
      where: { id: assignTicketDto.mentorId },
    });

    if (!mentor) {
      throw new NotFoundException(`Mentor with ID ${assignTicketDto.mentorId} not found`);
    }

    // Update ticket
    ticket.mentorId = assignTicketDto.mentorId;
    ticket.status = TicketStatus.ASSIGNED;

    // Update meet link if provided
    if (assignTicketDto.meetLink) {
      ticket.meetLink = assignTicketDto.meetLink;
    }

    const updatedTicket = await this.ticketRepository.save(ticket);

    // Send email notification to mentor
    try {
      await this.emailService.sendGeneralNotificationEmail(
        mentor.email,
        mentor.name,
        `New Ticket Assignment - #${ticket.serialNumber}`,
        `
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
        `
      );
    } catch (error) {
      console.error('Failed to send mentor email notification:', error);
      // Don't fail the operation if email fails
    }

    // Send email notification to student
    if (ticket.user) {
      try {
        await this.emailService.sendGeneralNotificationEmail(
          ticket.user.email,
          ticket.user.name,
          `Your Ticket Has Been Assigned - #${ticket.serialNumber}`,
          `
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
          `
        );
      } catch (error) {
        console.error('Failed to send student email notification:', error);
        // Don't fail the operation if email fails
      }
    }

    return this.mapToResponseDto(updatedTicket);
  }

  async closeTicket(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Ticket is already closed');
    }

    // Close the ticket first
    ticket.status = TicketStatus.CLOSED;
    await this.ticketRepository.save(ticket);

    // Then automatically delete it
    await this.ticketRepository.remove(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    await this.ticketRepository.remove(ticket);
  }

  private mapToResponseDto(ticket: Ticket): TicketResponseDto {
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
}
