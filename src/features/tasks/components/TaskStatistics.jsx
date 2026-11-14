function TaskStatistics({ total, active, completed, progress }) {
  return (
    <section className="task-statistics" aria-labelledby="statistics-heading">
      <div className="task-statistics__heading">
        <h2 id="statistics-heading">Your overview</h2>
        <p>Across all your tasks</p>
      </div>
      <dl className="task-statistics__metrics">
        <div>
          <dt>Total tasks</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Active</dt>
          <dd>{active}</dd>
        </div>
        <div>
          <dt>Completed</dt>
          <dd>{completed}</dd>
        </div>
      </dl>
      <div className="task-statistics__progress-heading">
        <label htmlFor="overall-progress">Overall progress</label>
        <span>{progress}%</span>
      </div>
      <progress
        id="overall-progress"
        className="task-statistics__progress"
        value={progress}
        max="100"
      >
        {progress}%
      </progress>
    </section>
  );
}

export default TaskStatistics;
