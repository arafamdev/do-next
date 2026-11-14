# DoNext

A personal frontend portfolio project: a minimal task manager designed to help you organize today and focus on what comes next.

## Project goal

Build an accessible, responsive application progressively, using small components and straightforward React data flow.

## Stack

- React with JavaScript and JSX
- Vite
- Vanilla CSS
- ESLint and Prettier

## Requirements

Use Node.js 22.12+ (or a newer supported release) and npm. The initial setup was validated with Node.js 26.3.0 and npm 11.16.0.

## Getting started

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Scripts

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the development server            |
| `npm run build`        | Create the production build in `dist/`  |
| `npm run preview`      | Preview the production build locally    |
| `npm run lint`         | Check JavaScript and JSX with ESLint    |
| `npm run format`       | Format project files with Prettier      |
| `npm run format:check` | Check formatting without changing files |

## Structure

```text
src/
  app/App.jsx
  shared/ui/AppHeader.jsx
  styles/app.css
  styles/globals.css
  main.jsx
public/
  favicon.svg
```

`main.jsx` mounts React and loads global styles. `App` composes the page and its empty task area. `AppHeader` presents the application identity. Global styles define the dark palette, spacing tokens and focus treatment; application styles define the layout and its components.

## Implemented

- Semantic application layout and heading hierarchy
- Application header and empty task state
- Fluid layout with wrapping content
- Dark palette with emerald accents
- CSS variables for future theme support
- Project linting, formatting and build scripts

Task creation and management are not implemented yet. The initial page has no interactive controls.

## Roadmap

1. Task creation and title validation
2. Completion, editing and deletion
3. Filters and search
4. Local storage persistence and invalid-data handling
5. Statistics and progress
6. Light theme and saved preference
7. Accessibility review, interaction polish, tests and deployment

## Maintenance

Keep components focused and state close to the feature that uses it. Add feature folders only when implementation needs them. Use a branch per feature and conventional commit messages. Run lint, formatting checks and the production build before integrating changes.

Adjust the variables in `src/styles/globals.css` to change the visual identity. Validate contrast whenever palette values change. The initial layout uses fluid sizing and wrapping instead of fixed viewport widths. No animations are included.
