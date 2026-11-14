import { useEffect, useRef, useState } from 'react';
import TaskForm from '../features/tasks/components/TaskForm.jsx';
import TaskFilters from '../features/tasks/components/TaskFilters.jsx';
import TaskStatistics from '../features/tasks/components/TaskStatistics.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import { createTaskWriter, loadTasks } from '../features/tasks/utils/taskStorage.js';
import useTheme from '../shared/hooks/useTheme.js';
import AppFooter from '../shared/ui/AppFooter.jsx';
import AppHeader from '../shared/ui/AppHeader.jsx';
import '../styles/app.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [initialStorage] = useState(loadTasks);
  const [tasks, setTasks] = useState(() => initialStorage.tasks);
  const [saveTasks] = useState(() => createTaskWriter(initialStorage));
  const [saveStatus, setSaveStatus] = useState('saved');
  const canPersist = initialStorage.status === 'empty' || initialStorage.status === 'valid';
  const recoveryMessages = {
    partial:
      'Some saved tasks could not be recovered. Valid tasks are shown, but changes will only last for this session. The original stored data has been preserved.',
    invalid:
      'Saved task data is invalid and could not be loaded. Changes will only last for this session. The original stored data has been preserved.',
    'read-error':
      'Saved tasks could not be read. Automatic saving is paused to protect existing data. Changes will only last for this session. Reload to retry loading; unsaved changes will be lost.',
  };
  const saveMessages = {
    conflict:
      'Tasks changed in another tab. Saving is paused to protect saved data. Your changes remain in this tab only. Copy any changes you want to keep before reloading; reloading loads the saved version.',
    unsupported:
      'Safe saving is unavailable in this browser. Changes remain in this tab only and will be lost when you reload or close it.',
    'lock-error':
      'Safe saving could not be coordinated. Changes remain in this tab only. Keep this tab open; another task change will retry saving.',
    'read-error':
      'Saved tasks could not be checked. Changes remain in this tab only. Keep this tab open; another task change will retry saving.',
    'write-error':
      'Tasks could not be saved in this browser. Changes remain in this tab only. Keep this tab open; another task change will retry saving.',
  };
  const storageMessage = recoveryMessages[initialStorage.status] ?? saveMessages[saveStatus];

  useEffect(() => {
    if (!canPersist) return;
    let ignoreResult = false;
    saveTasks(tasks).then((status) => {
      if (!ignoreResult) setSaveStatus(status);
    });
    return () => {
      ignoreResult = true;
    };
  }, [tasks, canPersist, saveTasks]);
  const taskInputRef = useRef(null);
  const bulkActionsRef = useRef(null);
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

  function handleCompleteAll() {
    bulkActionsRef.current?.focus();
    setTasks((previousTasks) =>
      previousTasks.every((task) => task.completed)
        ? previousTasks
        : previousTasks.map((task) => (task.completed ? task : { ...task, completed: true })),
    );
  }

  function handleReopenAll() {
    bulkActionsRef.current?.focus();
    setTasks((previousTasks) =>
      previousTasks.every((task) => !task.completed)
        ? previousTasks
        : previousTasks.map((task) => (task.completed ? { ...task, completed: false } : task)),
    );
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
          <div
            className="bulk-actions"
            ref={bulkActionsRef}
            role="group"
            aria-label="Actions for all tasks"
            aria-describedby="bulk-actions-description"
            tabIndex={-1}
          >
            <span className="bulk-actions__label">All tasks</span>
            <span className="visually-hidden" id="bulk-actions-description">
              These actions affect every task, including tasks hidden by filters or search.
            </span>
            <button type="button" onClick={handleCompleteAll} disabled={activeTasks === 0}>
              Complete all
            </button>
            <button type="button" onClick={handleReopenAll} disabled={completedTasks === 0}>
              Reopen all
            </button>
          </div>
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
      <AppFooter />
    </main>
  );
}

export default App;
