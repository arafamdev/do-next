import { Check, Circle, CircleCheck } from 'lucide-react';

function TaskList({ tasks, onToggleTask }) {
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
    <ul className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <li className={`task-card${task.completed ? ' task-card--completed' : ''}`} key={task.id}>
          <button
            className="task-card__toggle"
            type="button"
            aria-pressed={task.completed}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
            onClick={() => onToggleTask(task.id)}
          >
            {task.completed ? (
              <CircleCheck size={22} aria-hidden="true" />
            ) : (
              <Circle size={22} aria-hidden="true" />
            )}
          </button>
          <span className="task-card__title">{task.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
