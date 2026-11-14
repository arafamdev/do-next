import { useRef } from 'react';

import { Check } from 'lucide-react';

import TaskItem from './TaskItem.jsx';

function TaskList({
  tasks,
  hasTasks,
  matchesCriteria,
  taskInputRef,
  onResetFilters,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const listRef = useRef(null);

  function focusAfterRemoval(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    const cards = Array.from(listRef.current?.children ?? []);
    // Prefer nearby completion controls, skipping editing and confirmation actions.
    const candidates = [...cards.slice(taskIndex + 1), ...cards.slice(0, taskIndex).reverse()];
    const focusTarget =
      candidates
        .map((card) => card.querySelector(':scope > .task-card__toggle:not(:disabled)'))
        .find(Boolean) ?? taskInputRef.current;
    // Move focus before an operation removes its card from the visible list.
    focusTarget?.focus();
  }

  function handleToggle(taskId) {
    const task = tasks.find((task) => task.id === taskId);
    if (task && !matchesCriteria({ ...task, completed: !task.completed })) {
      focusAfterRemoval(taskId);
    }

    onToggleTask(taskId);
  }

  function handleUpdate(taskId, newTitle) {
    const task = tasks.find((task) => task.id === taskId);
    const remainsVisible = Boolean(task && matchesCriteria({ ...task, title: newTitle }));
    if (!remainsVisible) focusAfterRemoval(taskId);

    onUpdateTask(taskId, newTitle);

    return remainsVisible;
  }

  function handleDelete(taskId) {
    focusAfterRemoval(taskId);
    onDeleteTask(taskId);
  }

  if (tasks.length === 0 && hasTasks) {
    return (
      <div className="empty-state">
        <h3>No matching tasks found.</h3>
        <p>Try another search or reset your filters to see all tasks.</p>
        <button className="task-filters__reset" type="button" onClick={onResetFilters}>
          Clear search and show all
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__symbol" aria-hidden="true">
          <Check size={26} />
        </span>
        <h3>A fresh start</h3>
        <p>A little space to organize your day and focus on what matters.</p>
        <p className="empty-state__hint">Your tasks will appear here.</p>
      </div>
    );
  }

  return (
    <ul ref={listRef} className="task-list task-list-scroll" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={handleToggle}
          onUpdateTask={handleUpdate}
          onDeleteTask={handleDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
