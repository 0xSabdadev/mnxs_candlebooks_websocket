import { Test, TestingModule } from '@nestjs/testing';
import { VertexProtocolService } from './vertex-protocol.service';

describe('VertexProtocolService', () => {
  let service: VertexProtocolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VertexProtocolService],
    }).compile();

    service = module.get<VertexProtocolService>(VertexProtocolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
