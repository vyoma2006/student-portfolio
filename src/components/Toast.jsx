function Toast({ toasts, onDismiss }) {
    if (!toasts.length) return null;

    return (
        <div className="toast-stack">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`toast toast-${t.type}`}
                    onClick={() => onDismiss(t.id)}
                    role="status"
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}

export default Toast;