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
  features/tasks/components/TaskFilters.jsx
  features/tasks/utils/taskStorage.js
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

`TaskFilters` receives controlled filter and search values from `App`. All is selected initially; Active shows pending tasks and Completed shows completed tasks. Search matches titles case-insensitively and trims the query. `visibleTasks` is derived with `filter()` from the task array and both criteria, preserving order without a second task state or synchronization effects. Clear search retains the current filter; the no-results reset clears both criteria. The original empty state is reserved for an empty task array.

Operations retain the current criteria. Creation may add a hidden task; completion, reopening or editing can remove a card from the current view. `TaskList` moves focus to a surviving visible control or the creation input before such a card disappears. Search typing never triggers this focus handling. Search results are rendered without live announcements on each keystroke to avoid excessive speech.

## Local persistence

Tasks are automatically saved under `donext.tasks.v1` in `localStorage`. `taskStorage.js` exports the key, `loadTasks` and `saveTasks`. `App` uses a lazy `useState(loadTasks)` snapshot, then initializes the task array from its recovered tasks. An effect saves task changes only when the initial read was safe. React Strict Mode may repeat initialization and effects in development; reads do not modify storage and repeated writes use the same data.

The stored array preserves `{ id, title, completed }` and task order. Loading accepts non-empty string IDs and titles and boolean completion values. Invalid entries are skipped; the first valid entry for each ID wins. No replacement IDs or type coercions are used. `loadTasks` returns `{ tasks, status }`, distinguishing `empty`, `valid`, `partial`, `invalid` and `read-error`. Empty storage and fully valid arrays permit automatic saving, including saving an empty array after deleting the last task. Partial data recovers valid entries in order but pauses saving for the entire session. Invalid JSON, unexpected formats and read errors also pause saving. No recovery or loading path writes to storage, and no automatic write is attempted in these blocked sessions, even after CRUD operations.

Separate accessible messages explain partial recovery, invalid data, read failure and write failure. Original stored values remain untouched in recovery sessions. There is no overwrite/reset action: reload can retry reading after the underlying problem is resolved, but discards unsaved session changes. This deliberately avoids replacing potentially recoverable information without informed consent.

Write errors do not interrupt the in-memory application. A discrete status message warns that changes have not been saved; it remains visible until a later task change saves successfully. Filters, search, drafts, confirmations and focus state are not persisted.

Storage belongs to the browser profile and origin (including protocol, hostname and port); it does not synchronize across devices. Clearing browser data, private browsing, browser restrictions or quota limits can remove or prevent persistence. This is local convenience storage, not a backup. Concurrent tabs are not synchronized and the latest write wins.

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
- Combined All / Active / Completed filters and controlled title search
- Automatic local task persistence with validation and write-failure feedback
- Contextual no-results state with a reset action
- Keyboard submission and input focus management
- Lucide React icons with a visibly labelled add button
- Responsive form layout and reduced-motion support
- Project linting, formatting and build scripts

Tasks remain available after reload and new sessions while local storage is available. Statistics and a light theme are not implemented.

## Roadmap

1. Statistics and progress
2. Light theme and saved preference
3. Accessibility review, interaction polish, tests and deployment

## Maintenance

Keep components focused and state close to the feature that uses it. Add feature folders only when implementation needs them. Use a branch per feature and conventional commit messages. Run lint, formatting checks and the production build before integrating changes.

Adjust the variables in `src/styles/globals.css` to change the visual identity. Validate contrast whenever palette values change. The layout uses fluid sizing and wrapping. The form stacks its controls at widths up to 540px. Button hover uses a short color transition, disabled when reduced motion is requested.
