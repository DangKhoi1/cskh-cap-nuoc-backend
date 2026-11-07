import 'reflect-metadata';
import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { test } from 'node:test';
import { Test } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { otpSender } from '../dist/modules/auth/infrastructure/otp-sender.js';
import { InvoiceModule } from '../dist/modules/invoices/invoice.module.js';
import { AuthModule } from '../dist/modules/auth/auth.module.js';
import { UserModule } from '../dist/modules/users/user.module.js';
import { UserEntity } from '../dist/modules/users/infrastructure/persistence/user.entity.js';

test('register/login/profile/logout with real Better Auth cookies', async (t) => {
  const sentCodes = new Map();
  t.mock.method(otpSender, 'send', async ({ phoneNumber, code }) => {
    sentCodes.set(phoneNumber, code);
  });
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity],
        synchronize: false,
      }),
      AuthModule,
      UserModule,
      InvoiceModule,
    ],
  }).compile();
  const app = module.createNestApplication({
    logger: false,
    bodyParser: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: () =>
        new BadRequestException({ EC: 0, EM: 'Invalid request data' }),
    }),
  );
  const phones = [0, 1].map(
    () => '09' + String(randomInt(100000000)).padStart(8, '0'),
  );
  const canonicalPhone = (phone) => '+84' + phone.slice(1);
  const createdUserIds = [];
  t.after(async () => {
    const db = app.get(DataSource);
    try {
      await db.query(
        'DELETE FROM "session" WHERE "userId" IN (SELECT id FROM "user" WHERE id = ANY($1::text[]))',
        [createdUserIds],
      );
      await db.query(
        'DELETE FROM "account" WHERE "userId" IN (SELECT id FROM "user" WHERE id = ANY($1::text[]))',
        [createdUserIds],
      );
      await db.query('DELETE FROM "user" WHERE id = ANY($1::text[])', [
        createdUserIds,
      ]);
    } finally {
      await app.close();
    }
  });
  await app.init();
  const server = app.getHttpServer();
  const origin = process.env.BETTER_AUTH_URL;
  const client = request.agent(server).set('Origin', origin);
  const second = request.agent(server).set('Origin', origin);
  const password = 'Test-Password-936!';

  await client.get('/users/me').expect(401);
  await client.get('/invoices/unpaid').expect(401);
  const invalid = await client
    .post('/auth/register')
    .send({ phoneNumber: 'bad', password: 'short' })
    .expect(400);
  assert.equal(invalid.body.EC, 0);
  for (const body of [
    { userName: 'Bad', email: 'old@example.com', password },
    {
      userName: 'Bad',
      phoneNumber: phones[0],
      password,
      phoneNumberVerified: true,
    },
    { userName: 'Bad', phoneNumber: '123', password },
  ]) {
    await client.post('/auth/register').send(body).expect(400);
  }
  const getOtp = async (phone) => {
    await client.post('/auth/register/otp').send({ phoneNumber: phone }).expect(200);
    return sentCodes.get(canonicalPhone(phone));
  };
  const firstOtp = await getOtp(phones[0]);
  await client.post('/auth/register').send({ userName: 'Test User', phoneNumber: phones[0], password, otp: 'invalid' }).expect(400);
  const wrongOtp = firstOtp === '000000' ? '000001' : '000000';
  await client.post('/auth/register').send({ userName: 'Test User', phoneNumber: phones[0], password, otp: wrongOtp }).expect(400);
  await client.post('/api/auth/sign-up/email').send({ name: 'Blocked', email: 'blocked@example.com', password }).expect(400);
  const registered = await client
    .post('/auth/register')
    .send({ userName: 'Test User', phoneNumber: phones[0], password, otp: firstOtp })
    .expect(201);
  createdUserIds.push(registered.body.user.userId);
  assert.equal(registered.body.user.phoneNumber, canonicalPhone(phones[0]));
  assert.equal(registered.body.user.phoneNumberVerified, true);
  assert.equal(registered.body.user.email, undefined);
  assert.equal(registered.body.EC, 1);
  assert.equal(registered.body.EM, 'Register successfully');
  assert.ok(registered.headers['set-cookie']);
  assert.equal(registered.body.cookies, undefined);
  assert.equal(registered.body.token, undefined);
  await client.post('/auth/register').send({ userName: 'Replay', phoneNumber: phones[0], password, otp: firstOtp }).expect(400);
  const secondOtp = await getOtp(phones[1]);
  const secondRegistration = await second
    .post('/auth/register')
    .send({ userName: 'Other user', phoneNumber: phones[1], password, otp: secondOtp })
    .expect(201);
  createdUserIds.push(secondRegistration.body.user.userId);
  const previousMockUserId = process.env.MOCK_INVOICE_USER_ID;
  process.env.MOCK_INVOICE_USER_ID = registered.body.user.userId;
  t.after(() => {
    if (previousMockUserId === undefined) delete process.env.MOCK_INVOICE_USER_ID;
    else process.env.MOCK_INVOICE_USER_ID = previousMockUserId;
  });
  const invoices = await client.get('/invoices/unpaid?page=1&limit=2').expect(200);
  assert.equal(invoices.body.source, 'mock');
  assert.equal(invoices.body.data.total, 3);
  assert.equal(invoices.body.data.totalUnpaidAmount, 350000);
  assert.equal(invoices.body.data.items.length, 2);
  assert.ok(invoices.body.data.items.every((item) => item.status === 'UNPAID'));
  const nextPage = await client.get('/invoices/unpaid?page=2&limit=2').expect(200);
  assert.equal(nextPage.body.data.items[0].invoiceId, 'MOCK-003');
  assert.equal((await client.get('/invoices/unpaid?page=99').expect(200)).body.data.items.length, 0);
  assert.equal((await second.get('/invoices/unpaid').expect(200)).body.data.total, 0);
  await second.get('/invoices/unpaid').query({ userId: registered.body.user.userId }).expect(400);
  for (const query of ['page=0', 'limit=101', 'page=abc', 'page=1.5', 'customerCode=01030001']) {
    await client.get('/invoices/unpaid?' + query).expect(400);
  }
  const profile = await client.get('/users/me').expect(200);
  assert.equal(profile.body.user.userId, registered.body.user.userId);
  assert.equal(profile.body.user.phoneNumber, canonicalPhone(phones[0]));
  assert.equal(profile.body.user.phoneNumberVerified, true);
  assert.ok(!Number.isNaN(Date.parse(profile.body.user.createdAt)));
  const updated = await client
    .patch('/users/me')
    .send({ userName: ' New name ' })
    .expect(200);
  assert.equal(updated.body.user.userName, 'New name');
  assert.equal(
    (await second.get('/users/me').expect(200)).body.user.userName,
    'Other user',
  );
  await client
    .patch('/users/me')
    .send({ userName: 'Attack', userId: 'other' })
    .expect(400);
  const duplicateOtp = await getOtp(phones[0]);
  const duplicate = await request(server)
    .post('/auth/register')
    .set('Origin', origin)
    .send({
      otp: duplicateOtp,
      userName: 'Duplicate',
      phoneNumber: canonicalPhone(phones[0]),
      password,
    })
    .expect(400);
  assert.equal(duplicate.body.EC, 0);
  const cookie = registered.headers['set-cookie']
    .map((value) => value.split(';')[0])
    .join('; ');
  const logout = await client.post('/auth/logout').send({}).expect(200);
  assert.equal(logout.body.EC, 1);
  await client.get('/users/me').expect(401);
  await request(server).get('/users/me').set('Cookie', cookie).expect(401);
  const wrong = await client
    .post('/auth/login')
    .send({ phoneNumber: phones[0], password: 'WrongPassword123' })
    .expect(401);
  assert.equal(wrong.body.EC, 0);
  await client
    .post('/auth/login')
    .set('Origin', 'https://untrusted.example')
    .send({ phoneNumber: canonicalPhone(phones[0]), password })
    .expect(403);
  const login = await client
    .post('/auth/login')
    .send({ phoneNumber: canonicalPhone(phones[0]), password })
    .expect(200);
  assert.equal(login.body.EC, 1);
  assert.equal(login.body.user.userName, 'New name');
  await client.get('/users/me').expect(200);
});
