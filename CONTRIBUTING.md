# Contributing to KhmerCoders

Thank you for your interest in contributing! We welcome all kinds of contributions to the KhmerCoders community website, including bug reports, feature requests, code, and documentation.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Scripts Reference](#scripts-reference)
- [Database Migrations & Seeding](#database-migrations--seeding)
- [Coding Standards, Linting, Formatting, and Testing](#coding-standards-linting-formatting-and-testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community & Support](#community--support)

---

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster a welcoming and respectful community.

## How to Contribute

1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** and commit them with clear messages.
4. **Push to your fork** and submit a Pull Request (PR) to the `main` branch.
5. **Describe your changes** in the PR and reference any related issues.

## Development Setup

**Prerequisites:**
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) (`npm install -g wrangler`)
- [Cloudflare account](https://dash.cloudflare.com/) (for production deployments)

**Steps:**
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the setup script** to configure your environment and database:
   ```bash
   npm run setup
   ```
   This will:
   - Create a `.env` file (if missing)
   - Set up the local Cloudflare D1 database
   - Apply database migrations
   - Seed the database with initial data

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts Reference

### package.json scripts

| Script                | Purpose                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| db:generate           | Generate Drizzle ORM schema files                                       |
| db:clean              | Clean the local D1 database (see scripts/clean-database.js)             |
| db:seed               | Seed the main database (db/main/seed.sql)                               |
| db:seed:article       | Seed articles into the main database (db/main/seed-article.sql)         |
| db:migrate            | Apply local database migrations                                         |
| db:migrate:prod       | Apply production database migrations                                    |
| db:chatbot:schema     | Setup chatbot database schema                                           |
| db:chatbot:seed       | Seed chatbot database                                                   |
| generate:main-schema  | Generate a full schema SQL file for the main database                   |
| setup                 | Run all setup steps (env, DB, seeds, etc.) (see scripts/setup.js)       |

### scripts/ directory

| Script                   | Purpose                                                                                      |
|--------------------------|----------------------------------------------------------------------------------------------|
| clean-database.js        | Removes and recreates the local D1 database directory for a clean state                      |
| generate-auth-session.js | Generates a signed session token for testing authentication (requires BETTER_AUTH_SECRET)    |
| generate-main-schema.js  | Exports the current main D1 database schema to `db/main/schema.sql` for documentation/AI use |
| setup-env.js             | Creates a `.env` file with required secrets and placeholders if it doesn't exist             |
| setup.js                 | Runs all setup steps: env, clean DB, migrate, setup chatbot schema, and seed data            |

## Database Migrations & Seeding

- **Initialize setup:**
  ```bash
  npm run setup
  ```

- **Making changes to the database:**
  ```bash
  npm run db:generate    # Generate migration files
  npm run db:migrate     # Apply to local database
  npm run db:seed        # Add test data if needed
  ```

- **Reset the database:**
  ```bash
  npm run db:clean       # Clear everything
  npm run db:seed        # Add fresh test data
  ```

- **Working with Chatbot Feature:**
  ```bash
  npm run db:chatbot:schema # Create the schema
  npm run db:chatbot:seed   # Add test data
  ```

## Coding Standards, Linting, Formatting, and Testing

- **Linting:**
  - Run `npm run lint` to check for code issues using ESLint.
  - The project uses `eslint-config-next` and `eslint-config-prettier` for Next.js and Prettier compatibility.
  - Linting is set to be ignored during builds (see `next.config.mjs`).

- **Formatting:**
  - Run `npm run format` to auto-format code using Prettier.
  - Run `npm run format:check` to check formatting without making changes.

- **Testing:**
  - Run `npm run test` to execute tests using [Vitest](https://vitest.dev/).
  - Example tests are in `src/utils/example.test.ts` and `src/utils/experience.test.ts`.

- **General standards:**
  - Use consistent code style enforced by Prettier and ESLint.
  - Write clear, descriptive commit messages.
  - Prefer TypeScript for all new code.
  - Validate user input and handle errors gracefully.

## Pull Request Process

- Ensure your branch is up to date with `main` before submitting a PR.
- All PRs are subject to review. Please respond to feedback and make requested changes.
- Ensure your code passes linting, formatting, and tests, and builds successfully.
- Document any new scripts or changes in this file or the README.

## Reporting Issues

- Use [GitHub Issues](https://github.com/KhmerCoders/khmercoders-web/issues) to report bugs or request features.
- Provide as much detail as possible, including steps to reproduce, expected behavior, and screenshots if relevant.

## Community & Support

- Join our [Discord](https://discord.gg/vaE2Q3qGHy), [Telegram](https://t.me/+MuGVsenu2hA1MzU1), [Facebook](https://www.facebook.com/groups/khmercoders) for questions and discussions.
- Be respectful and constructive in all communications.

---

Thank you for helping make KhmerCoders better! 