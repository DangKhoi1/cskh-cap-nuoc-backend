# Register and login

Style: controller calls service, service returns EC/EM and handles errors with
try/catch. Better Auth handles hashing and session cookies; no custom JWT or
password storage is added. AuthService reads the input and builds the public EC/EM response.
BetterAuthClient calls Better Auth's handler and handles upstream errors so origin
checks remain active. The controller forwards the Set-Cookie headers.

## Setup

Configure DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME,
BETTER_AUTH_SECRET and BETTER_AUTH_URL in the backend .env. Better Auth's schema
must already exist. Run `npm run dev` from the backend folder.

The current flow is phone number + password. Phone OTP/Telegram is not enabled.
Vietnamese numbers such as `0912345678` are normalized to `+84912345678` before
registration/login. International numbers must start with `+`.

Run `npm run db:migrate:phone` once on an existing database to add nullable,
unique phone numbers and the verification flag. It is safe to rerun and preserves
old accounts. Existing email accounts are not automatically linked to a phone.

Better Auth still requires an email key for its credential engine internally.
The server derives `84912345678@phone.invalid` from the normalized phone; clients
send only phoneNumber/password. No mail is sent, and custom auth responses do not
expose this key. The real phone is stored in `user.phoneNumber`. New registrations
have `phoneNumberVerified: false` until a real verification flow is implemented.

## Postman

Base URL: `http://localhost:8080` (or your configured port).
Choose No Auth and Body -> raw -> JSON. Keep the cookie jar enabled and use the
same hostname for every request. Send these headers:

```text
Content-Type: application/json
Origin: http://localhost:8080
```

Origin must match BETTER_AUTH_URL or an explicitly trusted origin.

### Register: POST /auth/register

```json
{
  "userName": "Nguyen Van A",
  "phoneNumber": "0912345678",
  "password": "TestPassword123!"
}
```

Returns HTTP 201 with `{ "EC": 1, "EM": "Register successfully", "user": { ... } }`.
Registration also creates the login session cookie.

### Login: POST /auth/login

```json
{
  "phoneNumber": "0912345678",
  "password": "TestPassword123!"
}
```

Returns HTTP 200 with EC/EM/user and sets session cookies. Passwords and session
tokens are not included in the custom response body.

### Profile: GET /users/me

Send the saved cookies. Returns EC/EM/user for the authenticated account.

### Update: PATCH /users/me

```json
{ "userName": "New name" }
```

### Logout: POST /auth/logout

Body `{}`. Clears the cookie and revokes the session; `/users/me` then returns 401.

Expected service errors preserve their HTTP status and return EC: 0 with an EM
message. Validation uses the global ValidationPipe. Unauthenticated requests are
rejected by the integration's global guard using its native error response.
Native Better Auth routes under `/api/auth` remain available with their original
response format; use `/auth/register`, `/auth/login`, `/auth/logout` for EC/EM.

## Test

`npm run test:auth` builds and tests the real Nest/Better Auth/PostgreSQL flow.
It creates two accounts with random phone numbers in the configured database and removes
those accounts and their credentials/sessions afterward. Other users are retained.

## Code layout

- `auth.ts`: load environment variables and compose the Better Auth instance.
- `infrastructure/auth-user.config.ts`: phone fields and the registration hook.
- `phone-number.ts`: normalize phone numbers and convert internal login keys.
- `auth.service.ts`: registration/login/logout flow and public response mapping.
- `infrastructure/better-auth.client.ts`: invoke the handler and translate errors.
- `auth.controller.ts`: HTTP routes and cookie forwarding.

Auth and the standalone phone migration share `config/postgres.config.ts`.
The hook derives the phone from the internal login key; it never trusts a
client-supplied verification flag.
