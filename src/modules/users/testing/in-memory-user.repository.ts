import type {
  UpdateUserProfile,
  UserRepositoryPort,
} from '../application/ports/user.repository.port.js';
import type { User } from '../domain/entities/user.entity.js';
import { createMockUsers } from './mock-users.js';

// For demos/tests only. Not registered in UserModule.
export class InMemoryUserRepository implements UserRepositoryPort {
  private readonly users: Map<string, User>;

  constructor(users: User[] = createMockUsers()) {
    this.users = new Map(
      users.map((user) => [user.userId, structuredClone(user)]),
    );
  }

  findById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    return Promise.resolve(user ? structuredClone(user) : null);
  }

  updateProfile(
    userId: string,
    profile: UpdateUserProfile,
  ): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return Promise.resolve(null);
    const updated = {
      ...user,
      userName: profile.userName,
      updatedAt: new Date(),
    };
    this.users.set(userId, updated);
    return Promise.resolve(structuredClone(updated));
  }
}
