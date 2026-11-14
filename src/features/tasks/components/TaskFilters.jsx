import { Search, X } from 'lucide-react';

function TaskFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchInputRef,
}) {
  function handleClearSearch() {
    searchInputRef.current?.focus();
    onSearchChange('');
  }

  return (
    <div className="task-filters">
      <div className="task-filters__segments" role="group" aria-label="Filter tasks">
        {['all', 'active', 'completed'].map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="task-search">
        <label className="visually-hidden" htmlFor="task-search">
          Search tasks
        </label>
        <Search size={18} aria-hidden="true" />
        <input
          ref={searchInputRef}
          id="task-search"
          type="search"
          placeholder="Search tasks…"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchQuery && (
          <button type="button" aria-label="Clear search" onClick={handleClearSearch}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskFilters;
