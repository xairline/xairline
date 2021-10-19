import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Airport } from './airport.entity';
import { AirportService } from './airport.service';
import { getLogger } from '@xairline/shared-logger';
const logger = getLogger();
@Crud({
  model: {
    type: Airport,
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiTags('Airport')
@Controller('v1/airport')
export class AirportController implements CrudController<Airport> {
  constructor(public service: AirportService) {}
}

@Crud({
  model: {
    type: Airport,
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiTags('Airport')
@Controller('v1/nearestAirport')
@UseInterceptors(CrudRequestInterceptor)
export class ExtendedAirportController implements CrudController<Airport> {
  constructor(public service: AirportService) {}
  get base(): CrudController<Airport> {
    return this;
  }

  @Override('getManyBase')
  @Get()
  @ApiResponse({
    status: 200,
    type: Airport,
  })
  async getNearestAirport(@ParsedRequest() req: CrudRequest): Promise<Airport> {
    const coordinates = req.parsed.search.$and[2] as any;
    const { lat, lng } = coordinates;
    const dis = 2 ^ Math.cos((lat * Math.PI) / 180);
    const sql =
      'SELECT * FROM airport ORDER BY (($1-latitude)*($1-latitude)) + (($2- longitude)*($2- longitude)*$3) ASC LIMIT 1';
    const res = await this.service.getRepo().query(sql, [lat, lng, dis]);
    logger.debug(res);
    return res;
  }
}
