import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  });
});
