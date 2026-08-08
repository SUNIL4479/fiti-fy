<div align="center">

# FitiFy — Home Workout Coach

**Your AI-powered 24/7 personal fitness trainer, right in your browser.**

![Tech](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tech](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Tech](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)
![Tech](https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=threedotjs)
![Tech](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)
![Tech](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)
![Deploy](https://img.shields.io/badge/Vercel-deploy-black?style=flat-square&logo=vercel)

</div>

---

## About the Project

**FitiFy** (FitiFI) is a full-stack, AI-powered fitness coaching web application that acts as your personal trainer around the clock. Powered by Google Gemini, it delivers smart, adaptive workout routines, real-time voice coaching, interactive 3D exercise demonstrations, and personalized nutrition plans — all without leaving your browser.

### Key Features

| Feature | Description |
|---|---|
| AI Fitness Coach | Gemini-powered conversational coach that builds personalized workout plans based on your profile |
| Voice Coaching | Real-time audio coaching and feedback during workouts |
| 3D Exercise Demos | Interactive Three.js-powered 3D visualizations of exercises and proper form |
| Webcam Form Checker | Uses your camera to analyze and correct exercise posture in real time |
| Nutrition Plans | Custom AI-generated meal and nutrition plans tailored to your fitness goals |
| Gamification | Progress tracking, streaks, badges, and achievement system to keep you motivated |
| Dashboard & Analytics | Visual progress charts and workout history |
| Authentication | Secure user account management |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion (Framer) |
| **Backend** | Node.js, Express 4, TypeScript (tsx) |
| **AI / ML** | Google Gemini API (@google/genai) |
| **3D Graphics** | Three.js |
| **UI Icons** | Lucide React |
| **Build Tool** | Vite 6 |
| **Bundler (prod)** | esbuild |
| **Deployment** | Vercel (serverless Express function + static frontend) |

---

## Project Structure

```
FitiFI/
├── backend/             # Express API backend (Node + TypeScript)
│   ├── api/
│   │   └── index.ts         # Vercel serverless entrypoint (imports the Express app)
│   ├── src/
│   │   ├── app.ts           # Express app (auth, Gemini, ExerciseDB routes)
│   │   └── server.ts        # Local dev server entrypoint
│   └── package.json         # Backend dependencies & scripts
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/           # Three.js 3D exercise visualizations
│   │   │   ├── analytics/    # Progress charts & stats
│   │   │   ├── auth/         # Login / signup screens
│   │   │   ├── coach/        # AI coaching chat interface
│   │   │   ├── dashboard/    # Main user dashboard
│   │   │   ├── gamification/ # Badges, streaks, achievements
│   │   │   ├── landing/      # Landing / onboarding page
│   │   │   ├── layout/       # Shared layout components (Nav, etc.)
│   │   │   ├── nutrition/    # Nutrition plan UI
│   │   │   ├── pose/         # Webcam pose / form checker
│   │   │   └── workout/      # Workout routine player
│   │   ├── services/         # API, voice coach, workout logic
│   │   ├── data/             # Static fitness data
│   │   ├── App.tsx           # Root app component & routing
│   │   ├── types.ts          # Shared TypeScript types
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── vite.config.ts        # Vite config + /api dev proxy
│   └── package.json          # Frontend dependencies & scripts
├── vercel.json          # Vercel build + route configuration
├── tsconfig.json        # TypeScript configuration (root)
├── package.json         # npm workspaces (backend + frontend) & scripts
├── .env / .env.example  # Environment variables
└── .gitignore
```

The two source folders are `backend/` and `frontend/`. Everything else in the repo root is configuration: `package.json`, `vercel.json`, `tsconfig.json`, `.env`, `.env.example`, `.gitignore`, and `metadata.json` (AI Studio metadata).

---

## Prerequisites

- **[Node.js](https://nodejs.org/)** v18 or higher locally (v22 recommended; Vercel deploys with Node 24 via `engines`)
- **npm** v9+ (comes bundled with Node.js)
- A **Google Gemini API key** (free tier available)
- (Optional, for accounts) A **MongoDB** database

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

### 3. Run the Development Server

```bash
npm run dev
```

This starts both processes concurrently:

- **Frontend (Vite):** http://localhost:5173
- **Backend (Express):** http://localhost:3000 (API calls proxied from the frontend via `/api`)

---

## Environment Variables

```env
GEMINI_API_KEY="your-gemini-api-key-here"
MONGODB_URI="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DATABASE"
SESSION_SECRET="long-random-string"
APP_URL="http://localhost:3000"
```

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Powers all AI features (workout/nutrition generation, coaching, form analysis). Get one at https://aistudio.google.com/ |
| `MONGODB_URI` | For auth | MongoDB connection string used for user accounts and the leaderboard |
| `SESSION_SECRET` | Recommended | Signs the auth cookie (a long random string). Generated automatically in dev if omitted |
| `APP_URL` | Optional | The public URL where the app is hosted |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend dev servers together |
| `npm run dev:backend` | Backend only (Express on :3000) |
| `npm run dev:frontend` | Frontend only (Vite on :5173) |
| `npm run build` | Build both: frontend (`frontend/dist/`) + backend (`backend/dist/server.cjs`) |
| `npm run build:frontend` | Build the frontend only |
| `npm run build:backend` | Bundle the Express server with esbuild only |
| `npm start` | Run the production server build |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run clean` | Remove build output |

---

## Deploying to Vercel

The repo is configured for Vercel via `vercel.json` using the `builds` configuration:

- `backend/api/index.ts` — the Express app exported as a serverless function (built by `@vercel/node`).
- `frontend/package.json` — the Vite frontend built as static output by `@vercel/static-build` (output: `frontend/dist/`).
- Routes: `/api/*` requests go to the serverless function; all other routes fall back to the SPA (`/index.html`).

### Steps

1. Push the repo to GitHub and import it in Vercel (or run `vercel` CLI from the project root). Set the project Root Directory to the repo root (`FitiFI/`).
2. In **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
   - `SESSION_SECRET`
3. Deploy. No build command or output directory needs to be set manually — the `builds` config in `vercel.json` handles it.

> **Node.js version:** The root `package.json` pins `"engines": { "node": "24.x" }`. This forces Vercel to build and run on Node.js 24 (Node 20 is deprecated on Vercel and its builds will start failing after 2026-10-01). For extra safety you can also set **Settings → Build and Deployment → Node.js Version → 24.x** in the Vercel dashboard.
>
> Note: On Vercel the function runs on the `/api` route. The auth cookie is signed and stateless, so it works across serverless instances (no server-side session store needed).

---

## Browser Permissions

The app requests the following browser permissions at runtime:

| Permission | Used For |
|---|---|
| Camera | Webcam form checker to analyze exercise posture |
| Microphone | Voice coaching — speaking commands to the AI coach |

Both are optional — the app works without them. You will be prompted in-browser when you first use these features.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is private. All rights reserved.

---

<div align="center">
Made with love and powered by Google Gemini AI
</div>
