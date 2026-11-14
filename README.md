# DoNext

A personal frontend project: a minimal task manager designed to help you organize today and focus on what comes next.

## Project goal

Build an accessible, responsive application progressively, using small components and straightforward React data flow.

## Stack

- React with JavaScript and JSX
- Vite
- Vanilla CSS
- Lucide React SVG icons
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
  features/tasks/components/TaskForm.jsx
  features/tasks/components/TaskList.jsx
  features/tasks/components/TaskItem.jsx
  shared/ui/AppHeader.jsx
  styles/app.css
  styles/globals.css
  main.jsx
public/
  favicon.svg
```

`main.jsx` mounts React and loads global styles. `App` owns the task array and passes an `onAddTask` callback to `TaskForm` and the tasks plus an `onToggleTask` callback to `TaskList`. `AppHeader` presents the application identity. Global styles define the palette, spacing tokens and focus treatment; application styles group the layout, form, empty state and task cards.

`TaskForm` uses a controlled input, trims the title and rejects empty or whitespace-only submissions. Errors are associated with the input and announced through a live region. After creation, the field clears, focus returns to it and a status message announces success. Tasks can be submitted with Enter or the add button.

`App` creates each task as `{ id, title, completed }`, using `crypto.randomUUID()` and an immutable state update. `TaskList` renders semantic list items with stable IDs as keys, or the original empty state when there are no tasks.

`handleToggleTask` maps over the previous task array and replaces only the matching task with a copy whose `completed` value is inverted. IDs, titles and other tasks remain unchanged. Each task has a native toggle button with `aria-pressed`, a task-specific action label and visible keyboard focus. Completed tasks show a confirmation icon and a struck-through, muted title. Activate the button again to reopen the task.

`TaskItem` owns its inline editing state: the draft title, validation error and whether the editor is open. The Pencil button opens a labelled input with the current title. Save or Enter trims and validates the draft before calling `onUpdateTask`; Cancel or Escape discards it. Losing focus does not save. Focus moves into the editor and returns to the edit button when it closes. `App` updates only the matching title, preserves the ID and completion state, and returns the previous array when the title is unchanged.

Deletion is managed by `handleDeleteTask` in `App`, using a functional update and `filter()` to preserve the remaining tasks and their order. `onDeleteTask` passes through `TaskList` to `TaskItem`. Each item owns its inline confirmation state. Delete opens a non-modal confirmation with Cancel focused first; Cancel or Escape restores focus to the Delete icon. Confirmation is unavailable during editing. After deletion, `TaskList` focuses the next task’s completion button, then the previous task’s button if there is no next task, or the creation input when the list becomes empty. Deletion cannot be undone.

## Implemented

- Semantic application layout and heading hierarchy
- Application header and empty task state
- Fluid layout with wrapping content
- Dark palette with emerald accents
- CSS variables for future theme support
- Task creation with title validation and accessible feedback
- Dynamic task list with support for long titles
- Task completion and reopening with mouse and keyboard support
- Inline task editing with Save, Cancel, Enter, Escape and accessible validation
- Task deletion with inline confirmation, keyboard cancellation and focus management
- Keyboard submission and input focus management
- Lucide React icons with a visibly labelled add button
- Responsive form layout and reduced-motion support
- Project linting, formatting and build scripts

Tasks are stored only in React state and are lost on reload. Filters, persistence, statistics and a light theme are not implemented.

## Roadmap

1. Filters and search
2. Local storage persistence and invalid-data handling
3. Statistics and progress
4. Light theme and saved preference
5. Accessibility review, interaction polish, tests and deployment

## Maintenance

Keep components focused and state close to the feature that uses it. Add feature folders only when implementation needs them. Use a branch per feature and conventional commit messages. Run lint, formatting checks and the production build before integrating changes.

Adjust the variables in `src/styles/globals.css` to change the visual identity. Validate contrast whenever palette values change. The layout uses fluid sizing and wrapping. The form stacks its controls at widths up to 540px. Button hover uses a short color transition, disabled when reduced motion is requested.
