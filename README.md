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

2. For the frontend, create a `.env.local` file in the `apps/frontend-repo/` directory based on `.env.example`:

   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

## Running the Project in Development Mode

```bash
npm run dev
```

This command will start:

- Frontend (Next.js) at http://localhost:3000
- Backend (Express) at http://localhost:3001
- Firebase Emulator (Auth and Firestore) at various ports

The `dev` script in the root package.json uses `concurrently` to run both services in parallel:

- `turbo run dev --filter=frontend-repo`: Starts the Next.js frontend
- `turbo run dev:emulator --filter=backend-repo`: Starts both the Express API server and Firebase Emulator

#### Running Specific Applications

If you only want to run a specific application:

**Frontend:**

```bash
# From root directory
npm run dev:frontend

# Or from the frontend directory
cd apps/frontend-repo
npm run dev
```

**Backend with Firebase Emulator:**

```bash
# From root directory
npm run dev:backend

# Or from the backend directory
cd apps/backend-repo
npm run dev:emulator
```

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
