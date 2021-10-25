import {
  Controller,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { getLogger } from '@xairline/shared-logger';
import { Plane, PlaneApi } from '@xairline/shared-rest-client-remote';
import { JwtGuard, remoteConfiguration } from '@xairline/shared-rest-util';
import { XPlaneData } from '@xairline/shared-xplane-data';
import { Passenger } from '../passenger.entity';
import { PassengerService } from '../passenger.service';
const planeApi = new PlaneApi(remoteConfiguration);
const logger = getLogger();
@Crud({
  model: {
    type: Passenger,
  },
  routes: {
    createOneBase: { returnShallow: true },
    exclude: ['createManyBase', 'deleteOneBase', 'replaceOneBase'],
  },
})
@ApiTags('Passenger')
@Controller('passenger')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PassengerController implements CrudController<Passenger> {
  constructor(public service: PassengerService) {}
  get base(): CrudController<Passenger> {
    return this;
  }
  @Override('createOneBase')
  @Post()
  @ApiResponse({
    status: 200,
    type: Passenger,
  })
  async createPassenger(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Passenger
  ): Promise<Passenger> {
    const aircraft_type = dto.aircraft_type;
    const { data: availablePlanes } =
      await planeApi.getManyBasePlaneControllerPlane(undefined, undefined, [
        `status||$eq||normal`,
        `owned_by||$eq||${dto.airline_id}`,
      ]);
    const planes: Plane[] = (availablePlanes as Plane[]).filter(
      (plane: Plane) => {
        return plane.aircraft_type === aircraft_type;
      }
    );
    let baseCapacity = 0.0;
    if (planes.length > 0) {
      baseCapacity = planes[0].capacity;
      logger.info(`use own plane: ${baseCapacity}`);
    } else {
      throw new HttpException('Cannot find an aviable plane', 404);
    }
    const passenger: Passenger = {
      id: dto.id,
      total_number_of_passengers: Math.floor(
        Math.random() * (baseCapacity - baseCapacity * 0.4) + baseCapacity * 0.4
      ),
      delayed_flight_penalty_20: XPlaneData.randomGen(3, 7),
      delayed_flight_penalty_60: XPlaneData.randomGen(1, -1),
      delayed_flight_penalty_120: XPlaneData.randomGen(-30, -20),
      landing_g_force_penalty_1_5: XPlaneData.randomGen(7, 12),
      landing_g_force_penalty_2_0: XPlaneData.randomGen(1, -1),
      landing_g_force_penalty_2_5: XPlaneData.randomGen(-30, -20),
      landing_vs_penalty_1_5: XPlaneData.randomGen(3, 7),
      landing_vs_penalty_2_5: XPlaneData.randomGen(1, -1),
      landing_vs_penalty_3_0: XPlaneData.randomGen(-30, -5),
      satisfication: 100,
      aircraft_type,
      airline_id: dto.airline_id,
    };
    return this.base.createOneBase(req, passenger);
  }
}
