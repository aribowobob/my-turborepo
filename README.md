# Turborepo Monorepo

This is a monorepo built with Turborepo, containing a frontend (Next.js) and backend (Express) application.

## Prerequisites

Before getting started, make sure you have installed:

- Node.js (>=18)
- npm (>=11.3.0)
- Firebase CLI (for Firebase Emulator)

## Project Setup

Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd my-turborepo
npm install
```

### Environment Setup

1. For the backend, create a `.env` file in the `apps/backend-repo/` directory based on `.env.example`:
   ```
   NODE_ENV=development
   FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
   FIRESTORE_EMULATOR_HOST=localhost:8080
   JWT_SECRET=loremipsum
   PORT=3001
   ```

2. For the frontend, create a `.env.local` file in the `apps/frontend-repo/` directory if needed.

## Running the Project

### Development Mode

To run all applications and packages in development mode:

```bash
npm run dev
```

This command will start:
- Frontend (Next.js) at http://localhost:3000
- Backend (Express) at http://localhost:3001

#### Running Specific Applications

If you only want to run a specific application:

**Frontend:**
```bash
cd apps/frontend-repo
npm run dev
```

**Backend:**
```bash
cd apps/backend-repo
npm run dev
```

**Backend with Firebase Emulator:**
```bash
cd apps/backend-repo
npm run dev:emulator
```
Firebase Emulator will run at:
- Auth: http://localhost:9099
- Firestore: http://localhost:8080

### Production Mode

To build all applications for production:

```bash
npm run build
```

To run applications in production mode:

**Frontend:**
```bash
cd apps/frontend-repo
npm run start
```

**Backend:**
```bash
cd apps/backend-repo
npm run start
```

## Turborepo Features

### Local Caching

Turborepo caches build outputs locally to speed up subsequent builds.

### Remote Caching (Optional)

To enable Remote Caching with Vercel:

```bash
npx turbo login
npx turbo link
```

### Other Turborepo Commands

- **Linting:** `npm run lint`
- **Type Checking:** `npm run check-types`
- **Formatting:** `npm run format`

## Project Structure

```
my-turborepo/
├── apps/
│   ├── backend-repo/     # Backend Express.js with Firebase
│   └── frontend-repo/    # Frontend Next.js
├── packages/
│   └── shared/           # Shared types and utilities
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
