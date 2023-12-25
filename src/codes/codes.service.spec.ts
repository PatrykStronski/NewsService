import { Test, TestingModule } from '@nestjs/testing';
import { CodesService } from './codes.service';

describe('CodesService', () => {
  let service: CodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodesService],
    }).compile();

    service = module.get<CodesService>(CodesService);
  });

  it('Check code', () => {
    const code = service.generateCode();
    expect(code).toBeDefined();
    expect(code).toBeGreaterThan(99999);
    expect(code).toBeLessThan(1000000);
  });
});
