# DoNext

A minimal task manager for organizing your day and keeping track of what comes next.

## Live Demo

[Open DoNext](https://do-next-one.vercel.app/)

## Preview

### Desktop · Dark theme

![DoNext desktop dashboard in dark mode, showing task statistics, progress, search and the task list](docs/imagens/desktop-dark-preview.png)

### Desktop · Light theme

![DoNext desktop dashboard in light mode, with task creation, completion controls and inline actions](docs/imagens/desktop-light-preview.png)

### Smaller screens

| Mobile overview                                                                                             | Tablet task panel                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ![Mobile view of the DoNext header, stacked statistics, progress and bulk actions](docs/imagens/mobile.png) | ![Tablet view of DoNext with statistics, the creation form, filters and task cards](docs/imagens/tablet.png) |

The mobile and tablet images show portions of the responsive interface.

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

React 19 · Vite 8 · JavaScript / JSX · Vanilla CSS · Lucide React · localStorage · ESLint · Prettier

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

```text
src/
  main.jsx                 # Application entry point
  app/                     # State and application composition
  features/tasks/
    components/            # Forms, filters, statistics and task list
    utils/                 # Storage coordination and its tests
  shared/
    hooks/                 # Theme preference
    ui/                    # Header and footer
  styles/                  # Design tokens, layout and component styles
docs/
  ARCHITECTURE.md           # Implementation and maintenance guide
  imagens/                 # Application previews
```

`src/app/App.jsx` owns tasks and passes data and callbacks to components in `src/features/tasks/`. Filters, statistics and progress are derived from the task array. Editing drafts and deletion confirmations stay local to each task item.

Shared UI and theme logic live in `src/shared/`. CSS tokens are defined in `globals.css`, with layout and component styles in `app.css`.

The application uses React state and props without an external state library. See [Architecture and maintenance](docs/ARCHITECTURE.md) for component responsibilities, focus rules and storage details.

## Local data and limitations

Tasks are stored in the browser's `localStorage`; there is no account or cross-device synchronization. Safe task saving requires Web Locks. If coordination is unavailable, the application remains usable in memory and shows a warning.

A stale tab cannot overwrite changes saved by another cooperating tab: saving pauses and local edits remain in memory. Invalid or partially recoverable data is also protected from automatic overwrites. Copy unsaved changes before reloading or closing a blocked tab. Browser data can be cleared or unavailable, so local storage is not a backup.

## Accessibility and responsive layout

The interface uses semantic header, main and footer landmarks, labelled native controls, visible keyboard focus and live feedback for validation and storage problems. Task completion exposes its state through `aria-pressed`; editing and deletion support Escape and restore focus to a visible control.

Dark and light themes share the same layout. At suitable desktop widths and heights, the task list scrolls internally while the surrounding dashboard stays visible. Smaller or shorter windows allow document scrolling; controls stack on mobile, long titles wrap, and transitions respect `prefers-reduced-motion`.
