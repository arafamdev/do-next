import { useRef } from 'react';
import { Check } from 'lucide-react';
import TaskItem from './TaskItem.jsx';

function TaskList({ tasks, onToggleTask, onUpdateTask, onDeleteTask, taskInputRef }) {
  const listRef = useRef(null);

  function handleDelete(taskId) {
    const index = tasks.findIndex((task) => task.id === taskId);
    const cards = listRef.current?.children;
    const nextCard = cards?.[index + 1] ?? cards?.[index - 1];
    const focusTarget = nextCard?.querySelector('button') ?? taskInputRef.current;
    // Focus a surviving control before the deleted card unmounts.
    focusTarget?.focus();
    onDeleteTask(taskId);
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
    <ul ref={listRef} className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={handleDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
