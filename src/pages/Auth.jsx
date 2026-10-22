import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { login, register, isLoggedIn } from "../api";
import "../Auth.css";

// One component for both /login and /register
function Auth({ mode }) {
    const isRegister = mode === "register";
    const navigate = useNavigate();
    const location = useLocation();
    const expired = new URLSearchParams(location.search).get("expired");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (isLoggedIn()) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegister) await register(email, password);
            await login(email, password); // registering logs you straight in
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
                <p className="auth-sub">
                    {isRegister ? "Sign up to manage your tasks." : "Log in to see your tasks."}
                </p>

                {expired && !error && (
                    <div className="auth-notice">Your session expired. Please log in again.</div>
                )}
                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={loading}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            disabled={loading}
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait…" : isRegister ? "Register" : "Log in"}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister ? (
                        <>
                            Already have an account? <Link to="/login">Log in</Link>
                        </>
                    ) : (
                        <>
                            New here? <Link to="/register">Create an account</Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default Auth;