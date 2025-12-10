import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-tickte.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
