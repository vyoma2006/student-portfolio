import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoList from "../components/RepoList";

// Change this to your own GitHub username
const GITHUB_USERNAME = "vyoma2006";

function Projects() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchRepos() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(`GitHub API returned ${res.status}`);
                }

                const repos = await res.json();
                setData(repos);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to load repositories.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchRepos();
        return () => controller.abort();
    }, [reloadKey]);

    return (
        <div className="page">
            <h1>Projects</h1>
            <p className="page-sub">
                Live pull from my{" "}
                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                .
            </p>

            {loading && <Spinner />}
            {!loading && error && (
                <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
            )}
            {!loading && !error && <RepoList data={data} />}
        </div>
    );
}

export default Projects;