import AppHeader from '../shared/ui/AppHeader.jsx';
import '../styles/app.css';

function App() {
  return (
    <main className="app-shell">
      <AppHeader />
      <section className="tasks-panel" aria-labelledby="tasks-heading">
        <div className="tasks-panel__heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span className="tasks-panel__caption">A little clarity, every day.</span>
        </div>
        <div className="empty-state">
          <span className="empty-state__symbol" aria-hidden="true">
            ✓
          </span>
          <h3>A fresh start</h3>
          <p>A little space to organize your day and focus on what matters.</p>
          <p className="empty-state__hint">Your tasks will appear here.</p>
        </div>
      </section>
      <footer className="app-footer">One task at a time.</footer>
    </main>
  );
}

export default App;
