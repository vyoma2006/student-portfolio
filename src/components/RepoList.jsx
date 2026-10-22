const CHIP_COLORS = ["c1", "c2", "c3", "c4"];

function RepoList({ data }) {
    if (!data || data.length === 0) {
        return <p className="empty-state">No repositories found.</p>;
    }

    return (
        <ul className="repo-list">
            {data.map((repo, i) => (
                <li className="repo-card" key={repo.id}>
                    <div className="repo-card-head">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                        </a>
                        {repo.language && (
                            <span className={`chip ${CHIP_COLORS[i % CHIP_COLORS.length]} chip-sm`}>
                                {repo.language}
                            </span>
                        )}
                    </div>
                    {repo.description && <p className="repo-desc">{repo.description}</p>}
                    <a
                        className="repo-url"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {repo.html_url}
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default RepoList;