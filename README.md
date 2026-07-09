# Anime Vault — Next.js 14 Server-Side App

Your favorite anime, all in one place. A server-rendered anime browser built with
Next.js App Router, featuring **Server Actions**, **infinite scroll**, and
**Framer Motion** animations.

![Anime Website](https://i.ibb.co/MG1nbqt/YT-Thumbnails-2.png)

## Features

- **Server Actions** — anime cards are rendered on the server and streamed to the client.
- **Infinite scroll** — new pages load automatically as you reach the bottom, via
  `react-intersection-observer`.
- **Framer Motion** — cards fade in as they appear.
- **Graceful degradation** — the UI keeps working if the upstream API is unavailable.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shikimori API](https://shikimori.one/api/doc) for anime data

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the development server    |
| `npm run build` | Create a production build       |
| `npm run start` | Run the production build        |
| `npm run lint`  | Lint the codebase with ESLint   |

## References

- Server Actions — https://nextjs.org/docs/app/api-reference/functions/server-actions
- React Intersection Observer — https://www.npmjs.com/package/react-intersection-observer
- Framer Motion — https://www.framer.com/motion/
