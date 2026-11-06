# Users

The global Better Auth guard verifies the session. Controllers take the current
user ID from `@Session()` and call use cases. Use cases return `{ EC, EM, user }`
and keep expected HTTP errors (400/404) distinct from unexpected errors (500).

`BetterAuthUserRepository` uses TypeORM's `Repository<User>` to access Better Auth's
`user` table. `User` maps `id` to `userId` and `name` to `userName`. Its schema
synchronization is disabled because Better Auth owns that table.

Only the authenticated user's name can be updated. Email signup does not collect
phone numbers: profiles return `phoneNumber: null`, `phoneNumberVerified: false`.
Phone OTP/Telegram delivery is not implemented here.

The obsolete UUID-based `users` repository, profile guard, seed and memory mocks
were removed. Existing rows in the old database table were not deleted. They are
not login accounts; register through `/auth/register` to test.

See `../auth/README.md` for Postman requests. Run `npm run test:auth` for real
PostgreSQL integration tests with temporary accounts that are removed afterward.
