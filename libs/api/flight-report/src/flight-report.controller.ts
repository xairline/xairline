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
import { getLogger } from '@xairline/shared-logger';
import { LandingData } from '@xairline/shared-xplane-data';
import { FlightReport } from './flight-report.entity';
import { FlightReportService } from './flight-report.service';
import { JwtGuard } from '@xairline/shared-rest-util';
const logger = getLogger();
class FlightReportSummary {
  @ApiProperty({
    description: 'landing g force',
  })
  landingGForce: number;

  @ApiProperty({
    description: 'landing vs',
  })
  landingVS: number;

  @ApiProperty({
    description: 'xaa violations',
  })
  violations: string;

  @ApiProperty({
    description: 'date',
  })
  lastUpdate: Date;
}
@Crud({
  model: {
    type: FlightReport,
  },
  routes: {
    exclude: ['createManyBase', 'deleteOneBase', 'replaceOneBase'],
  },
})
@ApiTags('Flight')
@Controller('FlightReport')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class FlightReportController implements CrudController<FlightReport> {
  constructor(public service: FlightReportService) {}
}

@Crud({
  model: {
    type: FlightReportSummary,
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'deleteOneBase',
      'replaceOneBase',
      'getOneBase',
      'updateOneBase',
    ],
  },
})
@ApiTags('Flight')
@Controller('FlightReportSummary')
@UseInterceptors(CrudRequestInterceptor)
@ApiBearerAuth()
//@UseGuards(JwtGuard)
export class FlightReportSummaryController
  implements CrudController<FlightReport>
{
  constructor(public service: FlightReportService) {}
  get base(): CrudController<FlightReport> {
    return this;
  }
  @Override('getManyBase')
  @Get()
  @ApiResponse({
    status: 200,
    type: FlightReportSummary,
    isArray: true,
  })
  async getFlightReportSummary(
    @ParsedRequest() req: CrudRequest
  ): Promise<FlightReportSummary[]> {
    const reports: FlightReport[] = (await this.base.getManyBase(
      req
    )) as FlightReport[];

    const res: FlightReportSummary[] = [];

    reports.map((report) => {
      const landingData: LandingData = JSON.parse(report.landingData);

      res.push({
        lastUpdate: report.lastUpdate,
        landingGForce: landingData.gForce,
        landingVS: landingData.vs,
        violations: report.violation_events,
      });
    });

    return res;
  }
}
