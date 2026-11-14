import { Moon, Sun } from 'lucide-react';

function AppHeader({ theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-header__top">
        <p className="app-header__eyebrow">MAKE ROOM FOR WHAT MATTERS</p>
        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? (
            <Sun size={20} aria-hidden="true" />
          ) : (
            <Moon size={20} aria-hidden="true" />
          )}
        </button>
      </div>
      <h1>
        Do<span>Next</span>
        <span className="app-header__dot">.</span>
      </h1>
      <p className="app-header__description">Organize today. Focus on what's next.</p>
    </header>
  );
}

export default AppHeader;
