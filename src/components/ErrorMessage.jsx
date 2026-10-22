function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-box" role="alert">
            <p>⚠️ {message || "Something went wrong while fetching data."}</p>
            {onRetry && (
                <button type="button" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;