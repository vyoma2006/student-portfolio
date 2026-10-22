const PRIORITY_CHIP = { low: "c2", medium: "c4", high: "c1" };

function TaskList({ tasks, onToggle, onDeleteRequest, busyIds }) {
    if (!tasks || tasks.length === 0) {
        return <p className="empty-state">No tasks yet — add one above.</p>;
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => {
                const isBusy = busyIds.has(task._id);
                const isOptimistic = task._id.startsWith("temp-");

                return (
                    <li
                        key={task._id}
                        className={`task-item ${task.completed ? "task-done" : ""} ${
                            isOptimistic ? "task-pending" : ""
                        }`}
                    >
                        <label className="task-check">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                disabled={isBusy || isOptimistic}
                                onChange={() => onToggle(task)}
                            />
                            <div>
                                <span className="task-title">{task.title}</span>
                                {task.description && (
                                    <p className="task-desc">{task.description}</p>
                                )}
                            </div>
                        </label>

                        <div className="task-meta">
                            <span className={`chip chip-sm ${PRIORITY_CHIP[task.priority] || "c2"}`}>
                                {task.priority}
                            </span>
                            <button
                                type="button"
                                className="btn-danger-sm"
                                disabled={isBusy || isOptimistic}
                                onClick={() => onDeleteRequest(task)}
                            >
                                {isOptimistic ? "Saving…" : "Delete"}
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default TaskList;