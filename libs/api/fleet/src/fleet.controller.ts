import { FleetService } from './fleet.service';
import { JwtGuard } from '@xairline/shared-rest-util';
import {
  Controller,
  HttpException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Fleet } from './fleet.entity';

@Crud({
  model: {
    type: Fleet,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
})
@ApiTags('Fleet')
@Controller('Fleet')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class FleetController implements CrudController<Fleet> {
  constructor(public service: FleetService) {}
  get base(): CrudController<Fleet> {
    return this;
  }

  @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Fleet) {
    // find if there is one of same type listed already
    const aircraft_type = dto.aircraft_type;
    const listedFleet = await this.service.getFleetByType(aircraft_type);
    if (listedFleet.length > 0) {
      return;
    }
    // gen plane from metadata
    // random configuration
    // random paxCapacity
    // random price
    // save to database
  }
}
