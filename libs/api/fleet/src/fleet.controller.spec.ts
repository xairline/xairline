import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { Fleet } from './fleet.entity';
import { FleetService } from './fleet.service';
import { FleetModule } from './fleet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { FleetController } from './fleet.controller';
import { JwtModule } from '@nestjs/jwt';
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
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'ofcIDoNotUseThisOnProductio',
        }),
        FleetModule,
      ],
    }).compile();
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
