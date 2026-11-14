export const TASKS_STORAGE_KEY = 'donext.tasks.v1';

export function loadTasks() {
  let storedTasks;
  try {
    storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  } catch {
    return { tasks: [], status: 'read-error' };
  }

  if (storedTasks === null) return { tasks: [], status: 'empty' };

  try {
    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) return { tasks: [], status: 'invalid' };

    const seenIds = new Set();
    const validTasks = [];

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

    const status =
      validTasks.length === parsedTasks.length
        ? 'valid'
        : validTasks.length > 0
          ? 'partial'
          : 'invalid';
    return { tasks: validTasks, status };
  } catch {
    return { tasks: [], status: 'invalid' };
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
