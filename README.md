# The Open Shelf

The Open Shelf is a responsive book-sharing application where readers can discover books, contribute copies to a community collection, and manage borrowing and returns.

## Features

- Browse a paginated catalog and view book details.
- Discover the six latest unique titles in New Arrivals.
- Create an account and sign in with email/password or Google.
- Add books with an uploaded cover image.
- View, edit, and remove books you contributed.
- Borrow available copies and return borrowed books.
- Track copy availability across duplicate title and author listings.
- Protect Add Book, My Books, and My Borrows behind authentication.
- Responsive navigation, light/dark themes, and motion-reduced animations.

## Technologies

- **Next.js 16** — App Router, server rendering, and application routes.
- **React 19** — Client-side UI and interactive components.
- **Better Auth** — Email/password and Google authentication, backed by MongoDB.
- **Express API** — Book catalog, inventory, borrowing, and return operations. The API is maintained separately from this client.
- **Tailwind CSS 4** — Styling and responsive layouts.

## Main dependencies

| Dependency | Use |
| --- | --- |
| `next`, `react`, `react-dom` | Application framework and UI |
| `better-auth`, `@better-auth/mongo-adapter`, `mongodb` | Authentication and MongoDB storage |
| `@base-ui/react`, `shadcn`, `@heroui/react` | UI building blocks |
| `framer-motion` | Scroll-triggered reveal animations |
| `swiper` | Homepage image carousel |
| `lenis` | Smooth scrolling |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `tailwindcss`, `tw-animate-css`, `class-variance-authority`, `cn` | Styling utilities and component variants |

Development tools include ESLint, `eslint-config-next`, Tailwind's Turbopack integration, and the React Compiler Babel plugin.

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- A running book API and MongoDB connection for authentication.
- Google OAuth credentials for Google sign-in.
- An ImgBB API key for profile and book cover uploads.

### Install and run

```bash
npm install
npm run dev
```

Create a `.env.local` file in the project root and configure the variables below. Keep credentials private; do not commit `.env` files.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Origin of the Express book API, for example `http://localhost:5000` in local development |
| `BETTER_AUTH_URL` | Origin of this Next.js application; use `http://localhost:3000` locally |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_DB_URL` | MongoDB connection string for Better Auth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_API_KEY` | ImgBB API key used by the server-side image upload route |

The API also needs its own environment configuration. For deployment, configure `BETTER_AUTH_URL` to the deployed frontend origin and set the API's `AUTH_BASE_URL` to that same origin. Set `NEXT_PUBLIC_API_URL` to the deployed API origin. Configure Google OAuth's authorized JavaScript origin and redirect URI to match the deployed frontend and Better Auth callback URL.

Open the local URL printed by Next.js after starting the development server.

## Scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

## Project structure

```text
src/
  app/          Next.js routes and API handlers
  components/   Page sections, forms, and reusable UI
  lib/          Authentication, API, and book utilities
public/         Static assets such as the logo and carousel images
```
