import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TicktesService } from './ticktes.service';
import { CreateTicketDto } from './dto/create-tickte.dto';
import { UpdateTicketDto } from './dto/update-tickte.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin/admin-jwt-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
export class TicktesController {
  constructor(private readonly ticktesService: TicktesService) { }

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({
    status: 201,
    description: 'Ticket created successfully',
    type: TicketResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @Request() req
  ): Promise<TicketResponseDto> {
    return this.ticktesService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({
    status: 200,
    description: 'List of all tickets',
    type: [TicketResponseDto]
  })
  async findAll(): Promise<TicketResponseDto[]> {
    return this.ticktesService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all tickets for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of tickets for the user',
    type: [TicketResponseDto]
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserId(@Param('userId') userId: string): Promise<TicketResponseDto[]> {
    return this.ticktesService.findByUserId(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket by ID' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket found',
    type: TicketResponseDto
  })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticktesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully',
    type: TicketResponseDto
  })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto
  ): Promise<TicketResponseDto> {
    return this.ticktesService.update(id, updateTicketDto);
  }

  @Patch(':id/assign')
  // @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Assign a mentor to a ticket (Admin only)' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket assigned successfully',
    type: TicketResponseDto
  })
  @ApiResponse({ status: 404, description: 'Ticket or mentor not found' })
  @ApiResponse({ status: 400, description: 'Cannot assign closed ticket' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  async assignTicket(
    @Param('id') id: string,
    @Body() assignTicketDto: AssignTicketDto
  ): Promise<TicketResponseDto> {
    return this.ticktesService.assignTicket(id, assignTicketDto);
  }

  @Patch(':id/close')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Close and automatically delete a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({
    status: 204,
    description: 'Ticket closed and deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 400, description: 'Ticket already closed' })
  async closeTicket(@Param('id') id: string): Promise<void> {
    return this.ticktesService.closeTicket(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({ status: 204, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ticktesService.remove(id);
  }
}
