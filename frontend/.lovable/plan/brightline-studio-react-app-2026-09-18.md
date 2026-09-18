# Brightline Studio React App

## Build scope

- Adapt the uploaded frontend into the existing TanStack React app, preserving the five requested URLs: `/login`, `/`, `/about`, `/service`, and `/contact`.
- Add a shared sticky navigation bar and footer, including active links, mobile navigation, persistent dark mode, login state, and logout.
- Connect all authentication, service, and contact actions to `VITE_API_URL`, defaulting to `http://localhost:5000` during local development. No Lovable Cloud or built-in database will be used.

## Pages and behavior

- **Login:** animated login/register switch, display-name field for registration, live password hint, loading state, API errors, token storage, and redirect after success.
- **Home:** protected access, restored sessions, personalized greeting, service/contact actions, animated feature cards, and count-up statistics.
- **About:** polished company story with scroll-revealed principles and delivery process.
- **Service:** API-loaded cards, icon mapping, animated skeletons, fallback content, friendly inline failure notice, and retry action.
- **Contact:** live validation, submitting state, inline feedback, toast notifications, and form reset only after confirmed success.

## Design and accessibility

- Use the specified indigo/violet palette, neutral scale, semantic light/dark tokens, Inter typography, rounded cards, soft shadows, Lucide icons, and an approximately 1120px content width.
- Add quick route transitions, scroll reveals, hover/press states, visible keyboard focus, and reduced-motion support.
- Make layouts fully responsive below 720px and verify desktop and mobile rendering.

## Technical approach

- Use TanStack Router’s file-based routes instead of React Router DOM, with shared UI in the root layout.
- Keep authentication in a client context and browser storage, with an initial `/api/auth/me` session restoration request.
- Use native `fetch` with JSON headers for every API request.
- Add unique metadata for each content route and validate compilation plus key browser interactions.
