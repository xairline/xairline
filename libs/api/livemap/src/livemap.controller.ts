import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Livemap } from './livemap.entity';
import { LivemapService } from './livemap.service';
@Crud({
  model: {
    type: Livemap,
  },
  routes: {
    only: ['getManyBase', 'updateOneBase', 'createOneBase'],
  },
})
@ApiTags('Livemap')
@Controller('v1/livemap')
export class LivemapController {
  constructor(private service: LivemapService) {}
}
