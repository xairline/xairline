import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtGuard } from '@xairline/shared-rest-util';
import { XPlaneData } from '@xairline/shared-xplane-data';
import { Passenger } from '../passenger.entity';
import { PassengerService } from '../passenger.service';

class PassengerSummary {
  @ApiProperty({
    description: 'overall satification',
  })
  satification: number;
}
@Crud({
  model: {
    type: PassengerSummary,
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiTags('Passenger')
@Controller('PassengerSummary')
@UseInterceptors(CrudRequestInterceptor)
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PassengerSummaryController implements CrudController<Passenger> {
  constructor(public service: PassengerService) {}
  get base(): CrudController<Passenger> {
    return this;
  }
  @Override('getManyBase')
  @Get()
  @ApiResponse({
    status: 200,
    type: PassengerSummary,
  })
  async getPassengerSummary(
    @ParsedRequest() req: CrudRequest
  ): Promise<PassengerSummary> {
    const passengers: Passenger[] = (await this.base.getManyBase(
      req
    )) as Passenger[];

    let totalSatification = 0;
    passengers.map((passenger: Passenger) => {
      totalSatification += parseFloat(`${passenger.satisfication}`);
    });

    return {
      satification: XPlaneData.dataRoundup(
        totalSatification / passengers.length
      ),
    };
  }
}
