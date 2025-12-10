import { Test, TestingModule } from '@nestjs/testing';
import { TicktesController } from './ticktes.controller';
import { TicktesService } from './ticktes.service';

describe('TicktesController', () => {
  let controller: TicktesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicktesController],
      providers: [TicktesService],
    }).compile();

    controller = module.get<TicktesController>(TicktesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
