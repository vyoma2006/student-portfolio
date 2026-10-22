import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import "../Tasks.css";

const SAMPLE_TASKS = [
    {
        title: "Complete Practical 6 integration",
        description: "Wire React frontend to Express + MongoDB backend.",
        priority: "high",
    },
    {
        title: "Test API with Postman",
        description: "Test all CRUD operations end to end.",
        priority: "medium",
    },
    {
        title: "Review Mongoose schema validation",
        description: "Priority enum and pre-save trim hook.",
        priority: "low",
    },
];

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [creating, setCreating] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [busyIds, setBusyIds] = useState(new Set());
    const [pendingDelete, setPendingDelete] = useState(null);
    const [toasts, setToasts] = useState([]);

    // ---- toast helpers ----
    const pushToast = (message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => {
            setToasts((t) => t.filter((toast) => toast.id !== id));
        }, 3000);
    };
    const dismissToast = (id) => setToasts((t) => t.filter((toast) => toast.id !== id));

    // ---- initial + retry fetch ----
    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getTasks();
                setTasks(res.data || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [reloadKey]);

    // ---- create (optimistic) ----
    const handleCreate = async (taskInput) => {
        setCreating(true);
        const tempId = `temp-${Date.now()}`;
        const optimisticTask = {
            ...taskInput,
            _id: tempId,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        // Show it immediately, before the server confirms
        setTasks((prev) => [optimisticTask, ...prev]);

        try {
            const res = await createTask(taskInput);
            // Swap the temp task for the real one from the server
            setTasks((prev) => prev.map((t) => (t._id === tempId ? res.data : t)));
            pushToast("Task created", "success");
            return true;
        } catch (err) {
            // Roll back the optimistic task on failure
            setTasks((prev) => prev.filter((t) => t._id !== tempId));
            pushToast(err.message || "Failed to create task", "error");
            return false;
        } finally {
            setCreating(false);
        }
    };

    // ---- seed a few sample tasks at once ----
    const handleSeed = async () => {
        setSeeding(true);
        for (const sample of SAMPLE_TASKS) {
            await handleCreate(sample);
        }
        setSeeding(false);
    };

    // ---- toggle complete (update) ----
    const handleToggle = async (task) => {
        setBusyIds((prev) => new Set(prev).add(task._id));
        try {
            const res = await updateTask(task._id, { completed: !task.completed });
            setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
            pushToast("Task updated", "success");
        } catch (err) {
            pushToast(err.message || "Failed to update task", "error");
        } finally {
            setBusyIds((prev) => {
                const next = new Set(prev);
                next.delete(task._id);
                return next;
            });
        }
    };

    // ---- delete (with confirmation) ----
    const handleDeleteRequest = (task) => setPendingDelete(task);

    const confirmDelete = async () => {
        const task = pendingDelete;
        setPendingDelete(null);
        setBusyIds((prev) => new Set(prev).add(task._id));

        try {
            await deleteTask(task._id);
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
            pushToast("Task deleted", "success");
        } catch (err) {
            pushToast(err.message || "Failed to delete task", "error");
        } finally {
            setBusyIds((prev) => {
                const next = new Set(prev);
                next.delete(task._id);
                return next;
            });
        }
    };

    return (
        <div className="page tasks-page">
            <h1>Tasks</h1>
            <p className="page-sub">Backed by MongoDB — create, check off, or delete a task below.</p>

            <div className="seed-row">
                <button
                    type="button"
                    className="btn-ghost-sm"
                    onClick={handleSeed}
                    disabled={seeding || creating}
                >
                    {seeding ? "Adding sample tasks…" : "Add sample tasks"}
                </button>
            </div>

            <TaskForm onCreate={handleCreate} submitting={creating} />

            {loading && <Spinner />}
            {!loading && error && (
                <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
            )}
            {!loading && !error && (
                <TaskList
                    tasks={tasks}
                    onToggle={handleToggle}
                    onDeleteRequest={handleDeleteRequest}
                    busyIds={busyIds}
                />
            )}

            {pendingDelete && (
                <ConfirmDialog
                    message={`Delete "${pendingDelete.title}"? This can't be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            <Toast toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}

export default Tasks;