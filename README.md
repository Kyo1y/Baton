# Baton

A web app for transferring playlists between **Spotify** and **YouTube Music**.

---

## Features

- Transfer playlists from Spotify to YouTube Music and vice versa
- Step-by-step transfer flow with live progress tracking
- Connect and disconnect streaming service accounts independently
- Transfer history on the dashboard
- Sign in with Google or GitHub
- Light/dark theme

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Auth | NextAuth v4 — Google & GitHub providers, JWT sessions |
| Database | Prisma ORM + AWS DynamoDB (via custom AWS API) |
| Music APIs | Spotify Web API, YouTube Data API v3 |
| AI | OpenAI API |
| 3D Background | Vanta.js + Three.js |

---

## Project Structure

```
baton_frontend/
├── app/
│   ├── (actions)/          # Server actions (connect/disconnect service, transfers)
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   └── oauth/[provider]/ # Spotify & YouTube OAuth flow
│   ├── dashboard/          # Connected services + transfer history
│   ├── transfer/           # Multi-step transfer flow
│   ├── about/
│   ├── demo/
│   ├── privacy/ & terms/
│   └── status/
├── components/             # UI components (TransferStepper, Dashboard, etc.)
├── integrations/           # Spotify & YouTube provider registry
├── lib/
│   ├── aws/                # DynamoDB client
│   ├── spotify/            # Spotify API helpers
│   ├── ytmusic/            # YouTube Music API helpers
│   ├── tokens/             # OAuth token storage/retrieval
│   ├── transfers/          # Transfer execution logic
│   └── profile/            # User profile helpers
└── auth.ts                 # NextAuth config
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone <repo-url>
cd Baton/baton_frontend
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in `baton_frontend/` with the following:

```env
# NextAuth
NEXTAUTH_SECRET=

# Auth providers
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# AWS backend
AWS_API_URL=
AWS_API_KEY=

# Music service OAuth
SPOTIFY_CLIENT_ID=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=
```

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
