function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button type="button" className="btn-ghost-sm" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="btn-danger-sm" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;