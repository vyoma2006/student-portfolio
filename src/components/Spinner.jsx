function Spinner() {
    return (
        <div className="spinner-wrap" role="status" aria-live="polite">
            <span className="spinner"></span>
            <p>Fetching repositories…</p>
        </div>
    );
}

export default Spinner;