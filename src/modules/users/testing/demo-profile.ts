import 'reflect-metadata';
import assert from 'node:assert/strict';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetMyProfileUseCase } from '../application/use-cases/get-my-profile.use-case.js';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case.js';
import { InMemoryUserRepository } from './in-memory-user.repository.js';
import { createMockUsers } from './mock-users.js';

const repository = new InMemoryUserRepository();
const getProfile = new GetMyProfileUseCase(repository);
const updateProfile = new UpdateProfileUseCase(repository);
const users = createMockUsers();

console.log('Mock users (in memory, reset on every run):');
console.table(
  await Promise.all(users.map((user) => getProfile.execute(user.userId))),
);
const userId = users[0].userId;
const before = await getProfile.execute(userId);
const updated = await updateProfile.execute(userId, {
  userName: '  Nguyễn Văn An Updated (Demo)  ',
});
assert.equal(updated.userName, 'Nguyễn Văn An Updated (Demo)');
assert.equal(updated.phoneNumber, before.phoneNumber);
assert.equal(updated.phoneNumberVerified, before.phoneNumberVerified);
assert.deepEqual(await getProfile.execute(userId), updated);
assert.equal(
  (await getProfile.execute(users[1].userId)).userName,
  users[1].userName,
);
console.log('Updated profile:', updated);
await assert.rejects(
  updateProfile.execute(userId, { userName: '   ' }),
  BadRequestException,
);
console.log('PASS: blank name rejected (400).');
const missingId = '99999999-9999-4999-8999-999999999999';
await assert.rejects(getProfile.execute(missingId), NotFoundException);
await assert.rejects(
  updateProfile.execute(missingId, { userName: 'Missing user' }),
  NotFoundException,
);
console.log('PASS: missing user rejected (404) for both use cases.');
console.log(
  'PASS: profile updated and other users unchanged. No database writes.',
);
