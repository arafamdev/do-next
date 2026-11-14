export const TASKS_STORAGE_KEY = 'donext.tasks.v1';

export function loadTasks(storage) {
  let storedTasks;

  try {
    storedTasks = (storage ?? localStorage).getItem(TASKS_STORAGE_KEY);
  } catch {
    return { tasks: [], status: 'read-error' };
  }

  if (storedTasks === null) return { tasks: [], status: 'empty', snapshot: null };

  try {
    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) {
      return { tasks: [], status: 'invalid', snapshot: storedTasks };
    }

    const seenIds = new Set();
    const validTasks = [];

    // Recover usable entries in order without rewriting the source data.
    for (const task of parsedTasks) {
      if (
        task === null ||
        typeof task !== 'object' ||
        Array.isArray(task) ||
        typeof task.id !== 'string' ||
        !task.id.trim() ||
        typeof task.title !== 'string' ||
        !task.title.trim() ||
        typeof task.completed !== 'boolean' ||
        seenIds.has(task.id)
      ) {
        continue;
      }

      seenIds.add(task.id);
      validTasks.push({ id: task.id, title: task.title, completed: task.completed });
    }

    let status = 'invalid';
    if (validTasks.length === parsedTasks.length) {
      status = 'valid';
    } else if (validTasks.length > 0) {
      status = 'partial';
    }

    return { tasks: validTasks, status, snapshot: storedTasks };
  } catch {
    return { tasks: [], status: 'invalid', snapshot: storedTasks };
  }
}

export function createTaskWriter(
  initialStorage,
  { storage, locks = globalThis.navigator?.locks } = {},
) {
  // Each mounted App owns a snapshot; cooperating tabs share the lock.
  let expectedSnapshot = initialStorage.snapshot;
  let lastSavedSerialization = JSON.stringify(initialStorage.tasks);
  let hasConflict = false;

  return async function saveTasks(tasks) {
    if (!['empty', 'valid'].includes(initialStorage.status)) return initialStorage.status;
    if (hasConflict) return 'conflict';
    if (!locks?.request) return 'unsupported';

    try {
      return await locks.request(TASKS_STORAGE_KEY, { mode: 'exclusive' }, () => {
        // An earlier queued save may have detected a conflict while this one waited.
        if (hasConflict) return 'conflict';

        let target;
        let currentSnapshot;

        try {
          target = storage ?? localStorage;
          currentSnapshot = target.getItem(TASKS_STORAGE_KEY);
        } catch {
          return 'read-error';
        }

        // All cooperating tabs compare and write inside the same exclusive lock.
        if (currentSnapshot !== expectedSnapshot) {
          hasConflict = true;
          return 'conflict';
        }

        const nextSnapshot = JSON.stringify(tasks);
        if (nextSnapshot === lastSavedSerialization) return 'saved';

        try {
          target.setItem(TASKS_STORAGE_KEY, nextSnapshot);
        } catch {
          return 'write-error';
        }

        // Advance the snapshot before the next queued writer can run.
        expectedSnapshot = nextSnapshot;
        lastSavedSerialization = nextSnapshot;
        return 'saved';
      });
    } catch {
      return 'lock-error';
    }
  };
}
