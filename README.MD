# Basic Blog API

A small blogging platform API built with Deno, Hono, and Drizzle ORM.  
This project is an implementation reference for a blogging-platform API (inspired by: https://roadmap.sh/projects/blogging-platform-api).

## Overview

- Minimal REST API for posts, tags, and categories.
- Uses Drizzle for type-safe DB schema and queries.
- Validates input with drizzle-zod schemas.
- Structured as modular routes and DB query modules for learning and extension.

## Features

- CRUD for Tags, Categories, and Posts
- Input validation (insert/update schemas)
- Simple modular code organization
- Drizzle schema and query examples

## Tech stack

- Deno (runtime)
- Hono (HTTP framework)
- Drizzle ORM + drizzle-zod (DB schema & validation)
- PostgreSQL (expected via DATABASE_URL environment variable)
- TypeScript

## Quick start (macOS / Terminal)

1. Install Deno: https://deno.land/manual@v1.0.0/getting_started/installation
2. Set your database URL (Postgres example):
   ```bash
    DATABASE_URL="postgres://user:password@localhost:5432/mydb"
   ```
3. Start the app:
   ```bash
   deno run dev
   ```
   (See `deno.json` for available tasks.)

4. Open API at:
   ```
   http://localhost:1309/api/v1
   ```

## Configuration & Migrations

- DB connection is read from `DATABASE_URL` (see `env.ts`).
- Schema and migrations configured with `drizzle.config.ts`. Use Drizzle CLI/migration tooling to run migrations (see Drizzle docs).

## Example API requests

- List tags:
  ```bash
  curl http://localhost:1309/api/v1/tags
  ```

- Create a tag:
  ```bash
  curl -X POST http://localhost:1309/api/v1/tags \
    -H "Content-Type: application/json" \
    -d '{"name":"javascript"}'
  ```

- Update a tag (PATCH):
  ```bash
  curl -X PATCH http://localhost:1309/api/v1/tags/<id> \
    -H "Content-Type: application/json" \
    -d '{"name":"ts"}'
  ```

- Delete a tag:
  ```bash
  curl -X DELETE http://localhost:1309/api/v1/tags/<id>
  ```

Notes:
- Duplicate creates may return existing item with `alreadyExists: true`.
- Endpoints follow `/api/v1/{tags,categories,posts}` conventions.

## Suggestions for improvement (good next steps)

- Add tests (Deno test or integration tests)
- Add README usage examples and Postman collection
- Add migrations & seeds and document migration commands
- Add pagination, error middleware, and request logging
- Add authentication (JWT) and CORS policies for production
- Add CI and example deployment instructions

## Contributing

Contributions welcome. Open an issue or submit a PR with fixes or improvements.

## License

MIT
```// filepath: /Users/mcc/Desktop/deno/basic-blog-api/README.md
# Basic Blog API

A small blogging platform API built with Deno, Hono, and Drizzle ORM.  
This project is an implementation reference for a blogging-platform API (inspired by: https://roadmap.sh/projects/blogging-platform-api).

## Overview

- Minimal REST API for posts, tags, and categories.
- Uses Drizzle for type-safe DB schema and queries.
- Validates input with drizzle-zod schemas.
- Structured as modular routes and DB query modules for learning and extension.

## Features

- CRUD for Tags, Categories, and Posts
- Input validation (insert/update schemas)
- Simple modular code organization
- Drizzle schema and query examples

## Tech stack

- Deno (runtime)
- Hono (HTTP framework)
- Drizzle ORM + drizzle-zod (DB schema & validation)
- PostgreSQL (expected via DATABASE_URL environment variable)
- TypeScript

## Quick start (macOS / Terminal)

1. Install Deno: https://deno.land/manual@v1.0.0/getting_started/installation
2. Set your database URL (Postgres example):
   ```bash
   export DATABASE_URL="postgres://user:password@localhost:5432/mydb"
   ```
3. Start the app:
   ```bash
   deno task dev
   ```
   (See `deno.json` for available tasks.)

4. Open API at:
   ```
   http://localhost:1309/api/v1
   ```

## Configuration & Migrations

- DB connection is read from `DATABASE_URL` (see `env.ts`).
- Schema and migrations configured with `drizzle.config.ts`. Use Drizzle CLI/migration tooling to run migrations (see Drizzle docs).

## Example API requests

- List tags:
  ```bash
  curl http://localhost:1309/api/v1/tags
  ```

- Create a tag:
  ```bash
  curl -X POST http://localhost:1309/api/v1/tags \
    -H "Content-Type: application/json" \
    -d '{"name":"javascript"}'
  ```

- Update a tag (PATCH):
  ```bash
  curl -X PATCH http://localhost:1309/api/v1/tags/<id> \
    -H "Content-Type: application/json" \
    -d '{"name":"ts"}'
  ```

- Delete a tag:
  ```bash
  curl -X DELETE http://localhost:1309/api/v1/tags/<id>
  ```

Notes:
- Duplicate creates may return existing item with `alreadyExists: true`.
- Endpoints follow `/api/v1/{tags,categories,posts}` conventions.