import type { User } from '../domain/entities/user.entity.js';

// Synthetic phone numbers: placeholders only, never use for SMS.
export function createMockUsers(): User[] {
  return [
    {
      userId: '11111111-1111-4111-8111-111111111111',
      userName: 'Nguyễn Văn An (Demo)',
      phoneNumber: '+84000000001',
      phoneNumberVerified: true,
    },
    {
      userId: '22222222-2222-4222-8222-222222222222',
      userName: 'Trần Thị Bình (Demo)',
      phoneNumber: '+84000000002',
      phoneNumberVerified: false,
    },
    {
      userId: '33333333-3333-4333-8333-333333333333',
      userName: 'Lê Minh Châu (Demo)',
      phoneNumber: '+84000000003',
      phoneNumberVerified: true,
    },
  ].map((user) => ({
    ...user,
    createdAt: new Date('2026-11-01T00:00:00Z'),
    updatedAt: new Date('2026-11-01T00:00:00Z'),
  }));
}
