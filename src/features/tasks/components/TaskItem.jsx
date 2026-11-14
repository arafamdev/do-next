import { useEffect, useRef, useState } from 'react';
import { Circle, CircleCheck, Pencil } from 'lucide-react';

function TaskItem({ task, onToggleTask, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditingRef = useRef(false);
  const inputId = `edit-task-${task.id}`;
  const errorId = `${inputId}-error`;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else if (wasEditingRef.current) {
      editButtonRef.current?.focus();
    }
    wasEditingRef.current = isEditing;
  }, [isEditing]);

  function handleStartEditing() {
    setDraftTitle(task.title);
    setError('');
    setIsEditing(true);
  }

  function handleCancel() {
    setDraftTitle(task.title);
    setError('');
    setIsEditing(false);
  }

  function handleSave(event) {
    event.preventDefault();
    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setError('Enter a task title before saving it.');
      inputRef.current?.focus();
      return;
    }
    onUpdateTask(task.id, trimmedTitle);
    setIsEditing(false);
    setError('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
    }
  }

  return (
    <li className={`task-card${task.completed ? ' task-card--completed' : ''}`}>
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
      {isEditing ? (
        <form className="task-edit" onSubmit={handleSave} onKeyDown={handleKeyDown} noValidate>
          <label className="visually-hidden" htmlFor={inputId}>
            {`Edit title for "${task.title}"`}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            name="title"
            value={draftTitle}
            onChange={(event) => {
              setDraftTitle(event.target.value);
              setError('');
            }}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          <p className="task-edit__error" id={errorId} aria-live="polite">
            {error}
          </p>
          <div className="task-edit__actions">
            <button className="task-edit__save" type="submit">
              Save
            </button>
            <button className="task-edit__cancel" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <span className="task-card__title">{task.title}</span>
          <button
            ref={editButtonRef}
            className="task-card__edit"
            type="button"
            aria-label={`Edit "${task.title}"`}
            onClick={handleStartEditing}
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
        </>
      )}
    </li>
  );
}

export default TaskItem;
