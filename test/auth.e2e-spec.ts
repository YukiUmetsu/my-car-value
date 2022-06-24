import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const originalEmail = 'email@example.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: originalEmail, password: '1829jiowejf'})
      .expect(201)
      .then(res => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(originalEmail)
      });
  });

  it('signup as a new user, then get the currently logged in user', async () => {
    const email = 'email1111@example.com';
    const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({email, password: 'dkjfwoejiwoakfw8'})
        .expect(201)

    const cookie = res.get('Set-Cookie');
    const {body} = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200)

    expect(body.email).toEqual(email);
  })
});
