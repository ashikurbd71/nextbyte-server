import { Test, TestingModule } from '@nestjs/testing';
import { TicktesService } from './ticktes.service';

describe('TicktesService', () => {
  let service: TicktesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicktesService],
    }).compile();

    service = module.get<TicktesService>(TicktesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
