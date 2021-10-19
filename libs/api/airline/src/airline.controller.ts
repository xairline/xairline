import {
  Body,
  Controller,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { CrudController, CrudRequest } from '@nestjsx/crud/lib/interfaces';
import { getLogger } from '@xairline/shared-logger';
import { JwtGuard } from '@xairline/shared-rest-util';
import { Response as Res } from 'express';
import * as jwt from 'jsonwebtoken';
import * as md5 from 'md5';
import { Airline, AirlineToAirlineRelation } from './airline.entity';
import { AirlineRelationsService, AirlineService } from './airline.service';
const logger = getLogger();

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
@CrudAuth({
  property: 'user',
})
@ApiTags('Airline v2')
@Controller('v2/Airline')
export class AirlineControllerV2 implements CrudController<Airline> {
  constructor(public service: AirlineService) {}
  get base(): CrudController<Airline> {
    return this;
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest) {
    const res = await this.base.getOneBase(req);
    delete res.password;
    delete res.email;
    return res;
  }

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest) {
    const results = await this.base.getManyBase(req);
    for (const res of results as Airline[]) {
      delete res.password;
      if (res.email) {
        res.email = '-';
      }
    }
    return results;
  }

  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Airline
  ) {
    const airline = await this.service.findOne(dto.id);
    if (airline) {
      const errMsg = `airline exists already: ${dto.id}`;
      logger.error(errMsg);
      throw new HttpException(errMsg, 409);
    }
    return this.base.createOneBase(req, {
      ...dto,
      password: md5(dto.password),
    });
  }

  @Override('updateOneBase')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async updateOne(
    @Request() myReq,
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Airline
  ) {
    if (myReq.user.userId === id) {
      const res = await this.base.updateOneBase(req, dto);
      delete res.password;
      delete res.email;
      return res;
    }
    throw new HttpException('Not authorized', 403);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(CrudRequestInterceptor)
  @Patch(':id/cash')
  @ApiBody({ type: Airline })
  @ApiResponse({ type: Airline })
  async updateCash(
    @Request() myReq,
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @Body() dto: Airline
  ): Promise<Airline> {
    const res = await this.service.updateCash(id, dto.cash);
    delete res.password;
    delete res.email;
    return res;
  }

  @Post('login')
  @ApiBody({ type: Object })
  @ApiOkResponse()
  async login(
    @Body() dto: { id: string; password: string },
    @Response() res: Res
  ) {
    const airline = await this.service.find({
      where: { id: dto.id },
    });
    if (!airline[0].password) {
      await this.service.updatePassword(dto);
      res
        .cookie(
          'token',
          jwt.sign({ id: dto.id }, process.env.JWT_SECRET || 'ofcIDoNotUseThisOnProductio')
        )
        .send();
    }
    if (airline[0].password === md5(dto.password)) {
      res
        .cookie(
          'token',
          jwt.sign({ id: dto.id }, process.env.JWT_SECRET || 'ofcIDoNotUseThisOnProductio')
        )
        .send();
    } else {
      res.status(401).send();
    }
  }
}

@Crud({
  model: {
    type: AirlineToAirlineRelation,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'getOneBase'],
  },
})
@CrudAuth({
  property: 'user',
})
@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Airline Relations')
@Controller('v2/AirlineRelations')
export class AirlineRelationsController
  implements CrudController<AirlineToAirlineRelation>
{
  constructor(public service: AirlineRelationsService) {}
  get base(): CrudController<AirlineToAirlineRelation> {
    return this;
  }

  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AirlineToAirlineRelation
  ) {
    //enforce number of airlines you can apply
    //enforce number of pilots you can have
    const temp = await this.service.find({
      where: { owner_id: dto.owner_id, pilot_id: dto.pilot_id },
    });
    if (temp.length > 0) return;
    return this.base.createOneBase(req, dto);
  }
}
