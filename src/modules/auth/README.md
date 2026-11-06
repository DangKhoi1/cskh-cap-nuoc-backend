# Register and login

Style: controller calls service, service returns EC/EM and handles errors with
try/catch. Better Auth handles hashing and session cookies; no custom JWT or
password storage is added. The service calls Better Auth's handler so origin
checks remain active, then forwards its Set-Cookie headers through the controller.

## Setup

Configure DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME,
BETTER_AUTH_SECRET and BETTER_AUTH_URL in the backend .env. Better Auth's schema
must already exist. Run `npm run dev` from the backend folder.

The current flow is email/password, not phone OTP.

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
  "email": "vana@example.com",
  "password": "TestPassword123!"
}
```

Returns HTTP 201 with `{ "EC": 1, "EM": "Register successfully", "user": { ... } }`.
Registration also creates the login session cookie.

### Login: POST /auth/login

```json
{
  "email": "vana@example.com",
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
It creates two randomly named accounts in the configured database and removes
those accounts and their credentials/sessions afterward. Other users are retained.
