import { useState } from 'react';
import TaskForm from '../features/tasks/components/TaskForm.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import AppHeader from '../shared/ui/AppHeader.jsx';
import '../styles/app.css';

function App() {
  const [tasks, setTasks] = useState([]);

  function handleAddTask(title) {
    const newTask = { id: crypto.randomUUID(), title, completed: false };
    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  return (
    <main className="app-shell">
      <AppHeader />
      <section className="tasks-panel" aria-labelledby="tasks-heading">
        <div className="tasks-panel__heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span className="tasks-panel__caption">A little clarity, every day.</span>
        </div>
        <TaskForm onAddTask={handleAddTask} />
        <TaskList tasks={tasks} />
      </section>
      <footer className="app-footer">One task at a time.</footer>
    </main>
  );
}

export default App;
