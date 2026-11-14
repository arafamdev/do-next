import { useEffect, useLayoutEffect, useState } from 'react';

function useTheme() {
  const [selection, setSelection] = useState(() => ({
    theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
    isManual: ['dark', 'light'].includes(document.documentElement.dataset.themePreference),
  }));

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = selection.theme;
  }, [selection.theme]);

  useEffect(() => {
    if (selection.isManual) return;
    let media;
    function handleChange(event) {
      setSelection((previous) =>
        previous.isManual ? previous : { theme: event.matches ? 'light' : 'dark', isManual: false },
      );
    }
    try {
      media = window.matchMedia('(prefers-color-scheme: light)');
      media.addEventListener('change', handleChange);
    } catch {
      return;
    }
    return () => media.removeEventListener('change', handleChange);
  }, [selection.isManual]);

  function toggleTheme() {
    const nextTheme = selection.theme === 'dark' ? 'light' : 'dark';
    setSelection({ theme: nextTheme, isManual: true });
    try {
      localStorage.setItem('donext.theme.v1', nextTheme);
    } catch {
      // Keep the manual choice active for this session when storage is unavailable.
    }
  }

  return { theme: selection.theme, toggleTheme };
}

export default useTheme;
