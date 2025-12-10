import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicktesService } from './ticktes.service';
import { TicktesController } from './ticktes.controller';
import { Ticket } from './entities/tickte.entity';
import { Admin } from '../admin/entities/admin.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../admin/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Admin, User]),
  ],
  controllers: [TicktesController],
  providers: [TicktesService, EmailService],
  exports: [TicktesService],
})
export class TicktesModule { }
