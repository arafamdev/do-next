import { Check, ListTodo } from 'lucide-react';

function TaskList({ tasks }) {
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
        <li className="task-card" key={task.id}>
          <ListTodo className="task-card__icon" size={20} aria-hidden="true" />
          <span>{task.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
