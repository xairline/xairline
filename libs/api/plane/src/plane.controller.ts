import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Plane } from './plane.entity';
import { PlaneService } from './plane.service';
@Crud({
  model: {
    type: Plane,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
})
@ApiTags('Plane')
@Controller('v1/plane')
export class PlaneController implements CrudController<Plane> {
  constructor(public service: PlaneService) {}
}
