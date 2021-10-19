import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Airline } from './airline.entity';
import { AirlineService } from './airline.service';
import { XPlaneData } from '@xairline/shared-xplane-data';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios').default;

@Crud({
  params: {
    id: { type: 'uuid', primary: true, field: 'id' },
  },
  model: {
    type: Airline,
  },
  routes: {
    exclude: ['createManyBase', 'deleteOneBase', 'replaceOneBase'],
  },
})
@ApiTags('Airline')
@Controller('Airline')
export class AirlineController implements CrudController<Airline> {
  constructor(public service: AirlineService) {}
  get base(): CrudController<Airline> {
    return this;
  }
  @Override('getManyBase')
  @Get()
  async getAirline(@ParsedRequest() req: CrudRequest): Promise<Airline[]> {
    const res: Airline[] = (await this.base.getManyBase(req)) as Airline[];
    return res;
  }

  @Get('remoteVersion')
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getRemoteVersion(): Promise<string> {
    try {
      const res = await axios.get(
        'https://api.github.com/repos/xairline/xairline/releases/latest'
      );

      return res.data.tag_name || 'unknown';
    } catch (e) {
      return '0.0.0';
    }
  }
}
