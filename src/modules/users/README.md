# Users

The global Better Auth guard verifies the session. Controllers take the current
user ID from `@Session()` and call use cases. Use cases return a profile or throw
a ProfileError. The controller builds `{ EC, EM, user }` and maps errors to HTTP
400/404/500. Application code does not handle HTTP responses.

`User` in domain is a plain data contract. `BetterAuthUserRepository` uses
TypeORM's `Repository<UserEntity>` to access Better Auth's `user` table.
`UserEntity` in infrastructure maps `id` to `userId` and `name` to `userName`. Its schema
synchronization is disabled because Better Auth owns that table.

Only the authenticated user's name can be updated. Profile responses read phoneNumber and phoneNumberVerified from the user table.
Phone/password registration stores a normalized phone and leaves verification
false. Existing email-only accounts keep phoneNumber null. Phone OTP/Telegram
delivery is not implemented here.

The obsolete UUID-based `users` repository, profile guard, seed and memory mocks
were removed. Existing rows in the old database table were not deleted. They are
not login accounts; register through `/auth/register` to test.

See `../auth/README.md` for Postman requests. Run `npm run test:auth` for real
PostgreSQL integration tests with temporary accounts that are removed afterward.
