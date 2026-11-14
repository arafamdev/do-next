# Architecture and maintenance

This document explains the current implementation. For the live application, features and setup, see the [README](../README.md).

## Project structure

```text
src/
  app/App.jsx
  features/tasks/
    components/
      TaskForm.jsx
      TaskList.jsx
      TaskItem.jsx
      TaskFilters.jsx
      TaskStatistics.jsx
    utils/
      taskStorage.js
      taskStorage.test.js
  shared/
    hooks/useTheme.js
    ui/AppHeader.jsx
    ui/AppFooter.jsx
  styles/
    globals.css
    app.css
  main.jsx
public/favicon.svg
index.html
```

`main.jsx` mounts the application in React Strict Mode and loads global CSS. A neutral `.app-shell` wrapper contains sibling `header`, `main` and `footer` elements. The main landmark contains the overview and task panel.

## State and data flow

`App` owns the task array, active filter, search query and persistence feedback. A task contains only `{ id, title, completed }`. Creation uses `crypto.randomUUID()`. Functional state updates copy affected objects and preserve other tasks and their order.

`visibleTasks` is derived by combining the selected completion filter with a trimmed, case-insensitive title search. Clearing search preserves the filter; resetting the no-results view clears both criteria. Operations preserve the criteria, so a new or edited task may be hidden by the current view.

Statistics use the full array rather than filtered results. Progress is `Math.round((completed / total) * 100)`, or zero for an empty array. `TaskStatistics` receives derived values and renders a definition list and a labelled native `progress` element. No separate counter state or synchronization effect is needed.

Complete all and Reopen all also operate on the full array. They change only completion status, reuse unaffected objects and return the existing array when no task needs updating. Editing an unchanged title similarly avoids a new array. Props and callbacks are sufficient; there is no Context or external state store.

## Task interactions and focus

- `TaskForm` owns its controlled title, error and success feedback. Submission trims the title, rejects whitespace-only values, calls `onAddTask`, clears the input and restores focus. Errors are associated with the input and announced through a live region.
- `TaskList` renders a semantic list with stable task IDs as keys. It distinguishes an empty task array from an empty filtered result.
- `TaskItem` owns the editing flag, draft, validation error and deletion confirmation. Save or Enter validates and submits; Cancel or Escape discards the draft. Losing focus does not save. Completion uses a native button with `aria-pressed`, with an icon and struck-through text communicating the completed state.
- Deletion uses an inline, non-modal confirmation. Cancel is focused first; cancellation returns focus to Delete. Completion is disabled during confirmation, and editing does not expose deletion controls. Confirmed deletion cannot be undone.

Before deletion or a toggle/edit that removes a visible card, `TaskList` focuses an eligible completion control in a following card, then a preceding card, then the creation input. It skips disabled controls and does not select buttons inside editing forms or deletion confirmations. An edit that leaves its card visible returns focus to Edit; a filtered-out card does not attempt that restoration. Search typing does not move focus or announce every result change.

Bulk actions move focus to their stable, labelled group before buttons become disabled or filtered cards disappear. Its `tabIndex={-1}` permits programmatic focus without an extra Tab stop.

## Storage loading and recovery

`taskStorage.js` uses the unchanged key `donext.tasks.v1`. `loadTasks` reads without writing and returns recovered tasks and a status. After a successful storage read, it also returns the original string as `snapshot` (or `null` for a missing key).

Loading accepts non-empty string IDs and titles and boolean completion values. Invalid entries are skipped; the first valid entry for each ID wins. Recovered objects contain only the three task fields. No replacement IDs or type coercions are applied.

| Initial status | Result                                                |
| -------------- | ----------------------------------------------------- |
| `empty`        | Start with no tasks; safe saving may proceed          |
| `valid`        | Load the complete array; safe saving may proceed      |
| `partial`      | Show valid entries; block saving for the session      |
| `invalid`      | Show no recovered tasks; block saving for the session |
| `read-error`   | Show no recovered tasks; block saving for the session |

Malformed JSON and unexpected top-level formats are invalid. Blocked recovery sessions preserve the original stored value, including after local CRUD actions. Accessible messages explain the limitation. There is no automatic reset or overwrite action; reloading retries loading and discards unsaved edits.

## Coordinated task saving

`App` creates one `createTaskWriter` instance from its initial snapshot. Its effect submits task changes and ignores obsolete asynchronous feedback after cleanup. Strict Mode can repeat initialization and effects; loading has no write side effects and unchanged serialized tasks are not rewritten.

Each save requests an exclusive Web Lock named `donext.tasks.v1`. Inside the lock, the writer reads the current stored string and compares it with its expected snapshot. A mismatch permanently marks that writer as conflicted. Otherwise, changed tasks are written, and both the expected snapshot and last saved serialization advance before the lock is released. This also preserves the order of queued saves from the same tab.

No automatic merging, external-state replacement or bidirectional tab synchronization occurs. A conflict keeps local edits in memory and displays a warning to copy them before reloading. The saved version is loaded on reload. This protects cooperating tabs using this implementation; old versions, developer tools or external writers that ignore the lock cannot be coordinated. A `storage` listener alone or a read followed by an unlocked write would not serialize competing updates.

Missing Web Locks block saving with an `unsupported` result. Lock failures, read failures and write failures also prevent the write and show feedback; another task change can retry transient failures. Conflicts and initially unsafe recovery sessions remain blocked. Storage is scoped to the browser profile and origin, including protocol, hostname and port, and can be removed or restricted by browser settings or quota limits.

Only tasks are persisted by this mechanism. Filters, search, drafts, confirmations and focus state are session UI state.

## Theme initialization

The synchronous script in `index.html` reads `donext.theme.v1` before React renders, accepting only `dark` and `light`. Otherwise it follows `prefers-color-scheme`, with dark as the fallback when system information is unavailable. Storage and media-query errors are caught.

`useTheme` initializes from those root attributes and applies `data-theme` in a layout effect. It follows system changes until a manual choice exists. Manual toggles save the preference separately from tasks; a failed write retains the choice for the current session. Theme choices do not synchronize between tabs. Shared CSS tokens and `color-scheme` cover both themes without a theme animation or a separate system-mode control.

## Layout and maintenance

`globals.css` contains palette and spacing tokens and the global focus style. `app.css` groups layout and component rules. Adjust tokens to change the visual identity and check contrast after palette changes. Existing transitions respect `prefers-reduced-motion`.

At desktop widths of at least 64rem and heights of at least 50rem, the outer Grid holds header, main and footer. The main Grid holds overview and panel; `min-height: 0` allows the task list to shrink and scroll internally. Short lists retain natural height. Smaller or lower windows use document scrolling with a bounded list; storage warnings also allow natural document growth. Form controls stack up to 540px, and statistics become a single column at widths up to 380px.

Keep `.task-edit { position: relative; }`: it anchors the visually hidden edit label locally and preserves the correction for page overflow during editing. Scroll padding leaves space for focus outlines, while native focus scrolling keeps controls visible.

`AppFooter` contains the author, Frontend Developer description, real GitHub link, non-interactive LinkedIn label and dynamic copyright year. Add a LinkedIn anchor only when its real URL is available; there is no placeholder link or availability message.

## Validation

Run the storage tests with:

```sh
node --test src/features/tasks/utils/taskStorage.test.js
```

They cover successive saves, stale tabs, overlapping requests, queued same-tab writes, unsafe recovery, external changes, unavailable coordination and read/write failures using isolated storage and lock mocks. They do not replace browser tests of Web Locks, keyboard interactions or layout.

Before integration, run lint, formatting checks, the production build and `git diff --check`. When changing interactions, verify filtered-out edits, focus after removal and bulk actions. When changing layout, check desktop scrolling, the last task's editor, small screens and low-height windows. Keep components focused, use a branch per change and preserve conventional commit messages.
