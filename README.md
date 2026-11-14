# DoNext

A minimal task manager for organizing your day and keeping track of what comes next.

## Live Demo

[Open DoNext](https://do-next-one.vercel.app/)

## Features

- Create, edit, complete, reopen and delete tasks, with title validation and inline deletion confirmation.
- Combine All, Active and Completed filters with case-insensitive title search.
- Complete or reopen all tasks, including those hidden by filters or search.
- Track total, active and completed tasks with an overall progress indicator.
- Switch between dark and light themes, with system preference detection and a saved manual choice.
- Use keyboard controls, visible focus indicators, labelled inputs and accessible feedback.
- Browse a responsive layout with internal list scrolling and reduced-motion support.
- Keep tasks locally between sessions, with storage validation and protection against stale-tab writes.

## Stack

React 19 · JavaScript / JSX · Vite · Vanilla CSS · Lucide React · ESLint · Prettier

## Getting started

Use Node.js 22.12+ or a newer supported release, and npm.

```sh
git clone https://github.com/arafamdev/do-next.git
cd do-next
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Scripts and checks

| Command                                                    | Purpose                                  |
| ---------------------------------------------------------- | ---------------------------------------- |
| `npm run dev`                                              | Start the development server             |
| `npm run build`                                            | Generate the production build in `dist/` |
| `npm run preview`                                          | Preview the build locally                |
| `npm run lint`                                             | Check JavaScript and JSX                 |
| `npm run format:check`                                     | Check formatting                         |
| `npm run format`                                           | Format project files                     |
| `node --test src/features/tasks/utils/taskStorage.test.js` | Run focused storage and conflict tests   |

## Architecture and decisions

`src/app/App.jsx` owns tasks and passes data and callbacks to components in `src/features/tasks/`. Filters, statistics and progress are derived from the task array. Editing drafts and deletion confirmations stay local to each task item.

Shared UI and theme logic live in `src/shared/`. CSS tokens are defined in `globals.css`, with layout and component styles in `app.css`. Native HTML controls, semantic landmarks and explicit focus handling support keyboard navigation. The footer includes a working GitHub link and a non-interactive LinkedIn label until a real URL is available.

The application uses React state and props without an external state library. See [Architecture and maintenance](docs/ARCHITECTURE.md) for component responsibilities, focus rules and storage details.

## Local data and limitations

Tasks are stored in the browser's `localStorage`; there is no account or cross-device synchronization. Safe task saving requires Web Locks. If coordination is unavailable, the application remains usable in memory and shows a warning.

A stale tab cannot overwrite changes saved by another cooperating tab: saving pauses and local edits remain in memory. Invalid or partially recoverable data is also protected from automatic overwrites. Copy unsaved changes before reloading or closing a blocked tab. Browser data can be cleared or unavailable, so local storage is not a backup.
