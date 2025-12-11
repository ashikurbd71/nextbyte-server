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
exports.TicktesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ticktes_service_1 = require("./ticktes.service");
const create_tickte_dto_1 = require("./dto/create-tickte.dto");
const update_tickte_dto_1 = require("./dto/update-tickte.dto");
const assign_ticket_dto_1 = require("./dto/assign-ticket.dto");
const ticket_response_dto_1 = require("./dto/ticket-response.dto");
let TicktesController = class TicktesController {
    ticktesService;
    constructor(ticktesService) {
        this.ticktesService = ticktesService;
    }
    async create(createTicketDto, req) {
        return this.ticktesService.create(createTicketDto);
    }
    async findAll() {
        return this.ticktesService.findAll();
    }
    async findByUserId(userId) {
        return this.ticktesService.findByUserId(+userId);
    }
    async findOne(id) {
        return this.ticktesService.findOne(id);
    }
    async update(id, updateTicketDto) {
        return this.ticktesService.update(id, updateTicketDto);
    }
    async assignTicket(id, assignTicketDto) {
        return this.ticktesService.assignTicket(id, assignTicketDto);
    }
    async closeTicket(id) {
        return this.ticktesService.closeTicket(id);
    }
    async remove(id) {
        return this.ticktesService.remove(id);
    }
};
exports.TicktesController = TicktesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new support ticket' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ticket created successfully',
        type: ticket_response_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tickte_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tickets' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all tickets',
        type: [ticket_response_dto_1.TicketResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tickets for a specific user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of tickets for the user',
        type: [ticket_response_dto_1.TicketResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific ticket by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ticket found',
        type: ticket_response_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ticket updated successfully',
        type: ticket_response_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tickte_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a mentor to a ticket (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ticket assigned successfully',
        type: ticket_response_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket or mentor not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot assign closed ticket' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_ticket_dto_1.AssignTicketDto]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "assignTicket", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Close and automatically delete a ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Ticket closed and deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ticket already closed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "closeTicket", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Ticket deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicktesController.prototype, "remove", null);
exports.TicktesController = TicktesController = __decorate([
    (0, swagger_1.ApiTags)('tickets'),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [ticktes_service_1.TicktesService])
], TicktesController);
//# sourceMappingURL=ticktes.controller.js.map