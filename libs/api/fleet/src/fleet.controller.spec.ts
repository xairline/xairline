import { jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from '@xairline/shared-rest-util';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Fleet } from './fleet.entity';
import { FleetModule } from './fleet.module';
export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  })
);
describe('FleetController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: `/tmp/${Date.now()}`,
          synchronize: true,
          entities: [Fleet],
        }),
        TypeOrmModule.forFeature([Fleet]),
        FleetModule,
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();
    app = module.createNestApplication();
    await app.init().catch((e) => console.log(e));
  });

  it('should create a fleet by type', async () => {
    return request(app.getHttpServer()).get('/Fleet').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
