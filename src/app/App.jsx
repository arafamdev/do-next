import { useRef, useState } from 'react';
import TaskForm from '../features/tasks/components/TaskForm.jsx';
import TaskFilters from '../features/tasks/components/TaskFilters.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import AppHeader from '../shared/ui/AppHeader.jsx';
import '../styles/app.css';

function App() {
  const [tasks, setTasks] = useState([]);
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
      <AppHeader />
      <section className="tasks-panel" aria-labelledby="tasks-heading">
        <div className="tasks-panel__heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span className="tasks-panel__caption">A little clarity, every day.</span>
        </div>
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
