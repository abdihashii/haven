---
"@haven/api": minor
---

Add Better Auth integration with email/password authentication

- Switch from Fastify to Express adapter (required by `@thallesp/nestjs-better-auth`)
- Configure `AuthModule.forRoot()` with global auth guard and route mounting
- Add `DATABASE_URL` validation at startup with actionable error message
- Add `/protected` test endpoint demonstrating session-based auth
- Mock auth module in unit and e2e tests to avoid requiring a database
