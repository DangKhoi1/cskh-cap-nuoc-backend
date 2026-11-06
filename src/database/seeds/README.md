# Seed users

From the backend directory, run:

```sh
npm run seed:users
```

The command reads database connection settings from `.env` (existing environment
variables take precedence) and inserts the three fixtures from
`src/modules/users/testing/mock-users.ts` into PostgreSQL.

The database and `users` table must already exist. This script does not create or
synchronize the schema, even if DB_SYNCHRONIZE is enabled. All inserts run in one
transaction. Existing rows with a conflicting user ID or phone number are skipped
without overwriting them, so the script can be run repeatedly.

The output shows the number and details of newly inserted users. Phone numbers
are synthetic placeholders, not intended for OTP/SMS tests. This only seeds local
profiles; it does not create Better Auth accounts or sessions. `/users/me` still
requires authentication.
