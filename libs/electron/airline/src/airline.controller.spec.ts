import { Test } from '@nestjs/testing';
import { AirlineController } from './airline.controller';

describe.skip('AirlineController', () => {
  let controller: AirlineController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [AirlineController],
    }).compile();

    controller = module.get(AirlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
