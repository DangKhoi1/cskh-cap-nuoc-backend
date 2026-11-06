# Architecture decisions

## 2026-11-06: Keep backend boundaries explicit and code straightforward

- Domain contains plain business types, without TypeORM or HTTP dependencies.
- Application use cases validate input and coordinate repository ports. They
  return data or application errors, without HTTP status codes or EC/EM envelopes.
  Nest injection decorators remain for simple dependency wiring.
- Infrastructure owns database mappings, repositories and external auth details.
- Controllers map use-case results and errors to the existing HTTP contract.
- AuthService is a transport facade for Better Auth, not an application use case.
  Better Auth remains responsible for credentials, origin checks and sessions.
- Auth configuration composes named field definitions and registration hooks.
  PostgreSQL pool configuration is shared with standalone migrations.
- Prefer named steps, early returns and small functions. Add a new abstraction
  only to separate responsibilities or isolate an external dependency.

Existing routes, EC/EM messages, phone normalization and cookie behavior are
preserved. This refactor does not change the database schema.
