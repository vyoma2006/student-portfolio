import { useState } from "react";

function TaskForm({ onCreate, submitting }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("low");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const success = await onCreate({ title, description, priority });

        if (success) {
            setTitle("");
            setDescription("");
            setPriority("low");
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                required
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={submitting}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button type="submit" disabled={submitting || !title.trim()}>
                {submitting ? "Adding…" : "Add Task"}
            </button>
        </form>
    );
}

export default TaskForm;