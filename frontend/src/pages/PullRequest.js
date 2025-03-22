import React, { useState, useEffect } from "react";
import "../styles/PullRequest.css";

const PullRequest = () => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState("bcicen/ctop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const repositories = [
    { name: "ctop", fullName: "bcicen/ctop" },
    { name: "img", fullName: "genuinetools/img" },
  ];

  useEffect(() => {
    const fetchPullRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.github.com/repos/${selectedRepo}/pulls?state=all&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `token ${process.env.REACT_APP_GIT_TOKEN}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("API isteği başarısız: " + response.status);
        const data = await response.json();
        setPullRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPullRequests();
  }, [selectedRepo]);

  const openPulls = pullRequests.filter((pr) => pr.state === "open");
  const closedPulls = pullRequests.filter((pr) => pr.state === "closed");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setIsDropdownOpen(false);
  };

  return (
    <div className="pull-request-container">
      <div className="repo-selector">
        <h1 className="pull-request-title" onClick={toggleDropdown}>
          {repositories.find((repo) => repo.fullName === selectedRepo)?.name}{" "}
          Pull Requests
          <span className="dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
        </h1>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            {repositories.map((repo) => (
              <li
                key={repo.fullName}
                className="dropdown-item"
                onClick={() => handleRepoSelect(repo.fullName)}
              >
                {repo.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="pull-request-loading">Yükleniyor...</p>}
      {error && <p className="pull-request-error">{error}</p>}

      <section className="pulls-section">
        <h2 className="pulls-section-title">
          Açık Pull Requests ({openPulls.length})
        </h2>
        {openPulls.length > 0 ? (
          <div className="pulls-table task-table">
            <table>
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Durum</th>
                  <th>Oluşturulma Tarihi</th>
                  <th>Kaynak Dal</th>
                  <th>Hedef Dal</th>
                </tr>
              </thead>
              <tbody>
                {openPulls.map((pr) => (
                  <tr key={pr.id}>
                    <td>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-open-dot"></span>
                      {pr.state}
                    </td>
                    <td>{new Date(pr.created_at).toLocaleDateString()}</td>
                    <td>{pr.head.ref}</td>
                    <td>{pr.base.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-pulls">Henüz açık pull request yok.</p>
        )}
      </section>

      <section className="pulls-section">
        <h2 className="pulls-section-title">
          Kapalı Pull Requests ({closedPulls.length})
        </h2>
        {closedPulls.length > 0 ? (
          <div className="pulls-table task-table">
            <table>
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Durum</th>
                  <th>Kapanma Tarihi</th>
                  <th>Kaynak Dal</th>
                  <th>Hedef Dal</th>
                </tr>
              </thead>
              <tbody>
                {closedPulls.map((pr) => (
                  <tr key={pr.id}>
                    <td>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-closed-dot"></span>
                      {pr.state}
                    </td>
                    <td>{new Date(pr.closed_at).toLocaleDateString()}</td>
                    <td>{pr.head.ref}</td>
                    <td>{pr.base.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-pulls">Henüz kapalı pull request yok.</p>
        )}
      </section>
    </div>
  );
};

export default PullRequest;
