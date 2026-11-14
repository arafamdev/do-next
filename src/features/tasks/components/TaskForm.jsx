import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const inputRef = useRef(null);

  function handleChange(event) {
    setTitle(event.target.value);
    setError('');
    setStatus('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Enter a task title before adding it.');
      setStatus('');
      inputRef.current.focus();
      return;
    }

    onAddTask(trimmedTitle);
    setTitle('');
    setError('');
    setStatus('Task added.');
    inputRef.current.focus();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-title">What’s your next step?</label>
      <div className="task-form__controls">
        <input
          ref={inputRef}
          id="task-title"
          name="title"
          type="text"
          placeholder="Add something you want to get done"
          value={title}
          onChange={handleChange}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-title-error' : undefined}
        />
        <button type="submit">
          <Plus size={20} aria-hidden="true" />
          Add task
        </button>
      </div>
      <p className="task-form__error" id="task-title-error" aria-live="polite">
        {error}
      </p>
      <p className="visually-hidden" role="status">
        {status}
      </p>
    </form>
  );
}

export default TaskForm;
