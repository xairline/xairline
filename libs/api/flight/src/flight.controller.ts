import {
  Controller,
  HttpException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Airline } from '@xairline/shared-rest-client-remote';
import { JwtGuard } from '@xairline/shared-rest-util';
import { Flight } from './flight.entity';
import { FlightService } from './flight.service';
@Crud({
  model: {
    type: Flight,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
})
@ApiTags('Flight')
@Controller('Flight')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class FlightController implements CrudController<Flight> {
  constructor(public service: FlightService) {}
  get base(): CrudController<Flight> {
    return this;
  }
  @Override('deleteOneBase')
  async deleteOne(
    @Request() myReq,
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest
  ) {
    const flight = await this.service.findOne(id);
    if (myReq.user.userId === flight.owner_id) {
      this.base.deleteOneBase(req);
    }
    throw new HttpException('Not authorized', 403);
  }
}
