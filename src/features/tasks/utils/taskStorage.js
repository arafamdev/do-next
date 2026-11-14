export const TASKS_STORAGE_KEY = 'donext.tasks.v1';

export function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks === null) return [];

    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) return [];

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

    return validTasks;
  } catch {
    return [];
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
