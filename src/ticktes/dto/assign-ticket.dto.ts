import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignTicketDto {
    @IsNumber()
    @IsNotEmpty()
    mentorId: number;

    @IsString()
    @IsOptional()
    meetLink?: string;
}
