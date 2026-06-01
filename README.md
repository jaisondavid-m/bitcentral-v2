# BIT-CENTRAL

A lightweight student resource portal for BITS Atharva students — centralized access to question banks, answer keys, semester bundles and related study materials.

## What this project does

- Lists subject-wise materials (Module Tests, Semester bundles) fetched from a backend API.
- Provides fast search, filtering and PDF preview/download flows.
- Authentication + protected routes for student/admin users.
- Mobile-friendly responsive UI with accessible interactions.

## Why it's useful for students

- Single place to find previous question papers, module tests and answer keys.
- Fast search and subject filtering saves time when preparing for tests.
- Preview PDFs inline and open/download original files safely.
- Helps students quickly gather practice materials and assess topic coverage.

## Technical stack

- Frontend: React with Vite
- Styling: Tailwind CSS
- State & Data: React Context + TanStack Query (`@tanstack/react-query`)
- Routing: React Router
- HTTP client: Axios
- Animations: Framer Motion
- Icons: Lucide
- Backend & Auth: Firebase (auth + storage)
- Deployment targets: Vercel / Netlify / Cloudflare Workers (wrangler)

Key files:

- `src/Authentication/firebase.js` — Firebase initialization
- `src/api/axios.js` — Axios instance and API base URL
- `src/context/ThemeContext.jsx` — App theme (dark/light) handling
- `src/Pages/Semester.jsx` — Semester page and material listing

## Project structure (high level)

- `src/` — application source
	- `Authentication/` — firebase helpers
	- `Component/` — reusable UI components (NavBar, SubjectCard, SearchBar, modals)
	- `context/` — React contexts (`StudentContext`, `ThemeContext`)
	- `Pages/` — route pages (Semester, Home, Dashboard, etc.)
	- `api/` — `axios` client + server calls

## Environment variables

Create a `.env` file or set environment variables for Vite. Common variables used in the codebase:

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc. (Firebase config used by `src/Authentication/firebase.js`)
- `VITE_ADMIN_FIREBASE_UID` — optional admin UID used for admin-only routes
- `VITE_API_BASE` — optional base URL if the API is hosted separately (see `src/api/axios.js`)
- `PING_ON` — set to `true` to enable presence pings and admin auto-refresh polling; any other value disables both

## Run locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
npm run preview
```

## Notes & customization

- The global dark-mode toggle lives in the navbar (`src/Component/NavBar.jsx`) and is implemented via `ThemeContext`.
- The Semester page follows the global theme and its components adapt via `isDark`/`dark` props.
- To change API endpoints or extend features, edit `src/api/axios.js` and the relevant page components in `src/Pages/`.

## Contributing

- Open an issue for bugs or feature requests.
- Create branches off `main`, follow the existing code style, and open a pull request with a short description of your change.

## License

MIT — use and modify freely (add a LICENSE file if needed).

---
Want a `.env.example`, developer guide, or CI deploy script added? Tell me which and I'll scaffold it.
