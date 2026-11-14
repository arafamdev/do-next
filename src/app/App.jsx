import { useEffect, useRef, useState } from 'react';
import TaskForm from '../features/tasks/components/TaskForm.jsx';
import TaskFilters from '../features/tasks/components/TaskFilters.jsx';
import TaskStatistics from '../features/tasks/components/TaskStatistics.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import { loadTasks, saveTasks } from '../features/tasks/utils/taskStorage.js';
import useTheme from '../shared/hooks/useTheme.js';
import AppHeader from '../shared/ui/AppHeader.jsx';
import '../styles/app.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [initialStorage] = useState(loadTasks);
  const [tasks, setTasks] = useState(() => initialStorage.tasks);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const canPersist = initialStorage.status === 'empty' || initialStorage.status === 'valid';
  const recoveryMessages = {
    partial:
      'Some saved tasks could not be recovered. Valid tasks are shown, but changes will only last for this session. The original stored data has been preserved.',
    invalid:
      'Saved task data is invalid and could not be loaded. Changes will only last for this session. The original stored data has been preserved.',
    'read-error':
      'Saved tasks could not be read. Automatic saving is paused to protect existing data. Changes will only last for this session. Reload to retry loading; unsaved changes will be lost.',
  };
  const storageMessage =
    recoveryMessages[initialStorage.status] ??
    (storageUnavailable
      ? 'Tasks could not be saved in this browser. Changes will be kept only for this session until saving is available again.'
      : '');

  useEffect(() => {
    if (!canPersist) return;
    // Storage feedback depends on the result of this external synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageUnavailable(!saveTasks(tasks));
  }, [tasks, canPersist]);
  const taskInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  function matchesCriteria(task) {
    const matchesFilter =
      activeFilter === 'all' || (activeFilter === 'active' ? !task.completed : task.completed);
    return matchesFilter && task.title.toLowerCase().includes(normalizedQuery);
  }

  const visibleTasks = tasks.filter(matchesCriteria);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed === true).length;
  const activeTasks = totalTasks - completedTasks;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  function handleResetFilters() {
    searchInputRef.current?.focus();
    setActiveFilter('all');
    setSearchQuery('');
  }

  function handleAddTask(title) {
    const newTask = { id: crypto.randomUUID(), title, completed: false };
    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  function handleToggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function handleUpdateTask(taskId, newTitle) {
    setTasks((previousTasks) => {
      const taskToUpdate = previousTasks.find((task) => task.id === taskId);
      if (!taskToUpdate || taskToUpdate.title === newTitle) return previousTasks;

      return previousTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task,
      );
    });
  }

  function handleDeleteTask(taskId) {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
  }

  return (
    <main className="app-shell">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} />
      <TaskStatistics
        total={totalTasks}
        active={activeTasks}
        completed={completedTasks}
        progress={progress}
      />
      <section className="tasks-panel" aria-labelledby="tasks-heading">
        <div className="tasks-panel__heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span className="tasks-panel__caption">A little clarity, every day.</span>
        </div>
        {storageMessage && (
          <p className="storage-warning" role="status">
            {storageMessage}
          </p>
        )}
        <TaskForm onAddTask={handleAddTask} inputRef={taskInputRef} />
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
        />
        <TaskList
          tasks={visibleTasks}
          hasTasks={tasks.length > 0}
          matchesCriteria={matchesCriteria}
          onResetFilters={handleResetFilters}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          taskInputRef={taskInputRef}
        />
      </section>
      <footer className="app-footer">One task at a time.</footer>
    </main>
  );
}

export default App;
