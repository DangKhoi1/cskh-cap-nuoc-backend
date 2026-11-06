import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Test } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { UserModule } from '../dist/modules/users/user.module.js';
import { User } from '../dist/modules/users/domain/entities/user.entity.js';

test('users profile HTTP contract', async (t) => {
  const userId = 'e217eb75-05a2-47d4-991c-a68cdfb92fc8';
  let identity;
  let databaseFailure = false;
  let user = {
    userId,
    userName: 'Original name',
    phoneNumber: '0901234567',
    phoneNumberVerified: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    password: 'must never appear in responses',
  };
  const updates = [];
  const module = await Test.createTestingModule({ imports: [UserModule] })
    .overrideProvider(getRepositoryToken(User))
    .useValue({
      findOneBy: async (criteria) => {
        if (databaseFailure) throw new Error('PRIVATE_DATABASE_ERROR');
        return user?.userId === criteria.userId ? user : null;
      },
      update: async (criteria, changes) => {
        if (databaseFailure) throw new Error('PRIVATE_DATABASE_ERROR');
        updates.push({ criteria, changes });
        if (!user || user.userId !== criteria.userId) return { affected: 0 };
        user = { ...user, ...changes, updatedAt: new Date() };
        return { affected: 1 };
      },
    })
    .compile();
  const app = module.createNestApplication({ logger: false });
  // Test applications do not execute main.ts.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          EC: 0,
          EM: 'Invalid request data',
          errors: errors.flatMap((error) =>
            Object.values(error.constraints || {}),
          ),
        }),
    }),
  );
  // Simulate a trusted upstream authentication layer, only within this test.
  app.use((req, _res, next) => {
    req.user = identity;
    next();
  });
  await app.init();
  t.after(() => app.close());
  const server = app.getHttpServer();

  await t.test(
    'rejects anonymous requests and client supplied identity',
    async () => {
      await request(server)
        .get('/users/me')
        .set('x-user-id', userId)
        .expect(401);
      await request(server)
        .patch('/users/me')
        .send({ userId, userName: 'Attacker' })
        .expect(401);
      assert.equal(updates.length, 0);
    },
  );
  identity = { userId };
  await t.test('returns only public profile fields', async () => {
    const response = await request(server).get('/users/me').expect(200);
    assert.equal(response.body.EC, 1);
    assert.equal(response.body.EM, 'Get user profile successfully');
    assert.deepEqual(
      Object.keys(response.body.user).sort(),
      [
        'userId',
        'userName',
        'phoneNumber',
        'phoneNumberVerified',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    assert.equal(response.body.user.userId, userId);
  });
  await t.test(
    'rejects invalid names and protected fields without writing',
    async () => {
      for (const body of [
        {},
        { userName: null },
        { userName: 123 },
        { userName: '   ' },
        { userName: 'a'.repeat(101) },
        { userName: 'Name', phoneNumberVerified: true },
        { userName: 'Name', phoneNumber: '0912345678' },
        { userName: 'Name', userId },
      ]) {
        await request(server).patch('/users/me').send(body).expect(400);
      }
      assert.equal(updates.length, 0);
    },
  );
  await t.test(
    'trims the name and updates only the authenticated user',
    async () => {
      const response = await request(server)
        .patch('/users/me')
        .send({ userName: '  New name  ' })
        .expect(200);
      assert.equal(response.body.user.userName, 'New name');
      assert.equal(response.body.user.phoneNumber, '0901234567');
      assert.equal(response.body.user.phoneNumberVerified, true);
      assert.equal(response.body.user.password, undefined);
      assert.deepEqual(updates, [
        { criteria: { userId }, changes: { userName: 'New name' } },
      ]);
    },
  );
  await t.test(
    'returns 404 for a deleted user without recreating it',
    async () => {
      user = null;
      await request(server).get('/users/me').expect(404);
      await request(server)
        .patch('/users/me')
        .send({ userName: 'Name' })
        .expect(404);
      assert.equal(user, null);
    },
  );
  await t.test('returns EC/EM for database failures without leaking details', async () => {
    databaseFailure = true;
    for (const response of [
      await request(server).get('/users/me').expect(500),
      await request(server).patch('/users/me').send({ userName: 'Name' }).expect(500),
    ]) {
      assert.equal(response.body.EC, 0);
      assert.match(response.body.EM, /^Unable to/);
      assert.equal(JSON.stringify(response.body).includes('PRIVATE_DATABASE_ERROR'), false);
    }
  });

});
