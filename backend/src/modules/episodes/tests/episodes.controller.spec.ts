import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller.js';
import { EpisodesService } from './episodes.service.js';

describe('EpisodesController', () => {
  let controller: EpisodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [EpisodesService],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
