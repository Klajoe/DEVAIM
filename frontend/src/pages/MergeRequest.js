import React, { useState, useEffect } from "react";
import "../styles/MergeRequest.css";

const MergeRequest = () => {
  // State tanımlamaları: Issue'lar, yüklenme durumu, hata mesajı, seçili repo ve dropdown durumu
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState("bcicen/ctop"); // Varsayılan repo
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // GitHub API token'ı çevre değişkeninden alınıyor
  const GITHUB_TOKEN = process.env.REACT_APP_GIT_TOKEN; // Token'ını buraya yaz

  // Mevcut projeler: Dropdown için repo seçenekleri
  const repositories = [
    { name: "ctop", fullName: "bcicen/ctop" },
    { name: "img", fullName: "genuinetools/img" },
  ];

  // Seçilen repoya göre issue'ları çekmek için useEffect
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      try {
        // GitHub API'den issue'ları çek
        const response = await fetch(
          `https://api.github.com/repos/${selectedRepo}/issues?state=all&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          }
        );

        // HTTP yanıtı başarısızsa hata fırlat
        if (!response.ok)
          throw new Error("API request failed: " + response.status);
        const data = await response.json();
        setIssues(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchIssues();
  }, [selectedRepo]); // selectedRepo değiştiğinde yeniden çalışır

  // Issue'ları duruma göre filtrele
  const openIssues = issues.filter((issue) => issue.state === "open");
  const closedIssues = issues.filter((issue) => issue.state === "closed");

  // Dropdown'ı açma/kapama fonksiyonu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Repo seçildiğinde state'i güncelle ve dropdown'u kapat
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setIsDropdownOpen(false); // Seçim yapıldığında dropdown kapanır
  };

  return (
    <div className="merge-request-container">
      <div className="repo-selector">
        {/* Başlık: Seçili repo adını gösterir ve dropdown'u açar */}
        <h1 className="merge-request-title" onClick={toggleDropdown}>
          {repositories.find((repo) => repo.fullName === selectedRepo)?.name}{" "}
          GitHub Issues
          <span className="dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
        </h1>
        {/* Dropdown menüsü: Açık olduğunda repo seçeneklerini listeler */}
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

      {/* Yüklenme durumu: API'den veri çekilirken gösterilir */}
      {loading && <p className="merge-request-loading">Loading...</p>}
      {/* Hata durumu: API isteği başarısız olursa gösterilir */}
      {error && <p className="merge-request-error">{error}</p>}

      <section className="issues-section">
        {/* Açık issue'ların listesi */}
        <h2 className="issues-section-title">
          Open Issues ({openIssues.length})
        </h2>
        {openIssues.length > 0 ? (
          <div className="issues-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Creation Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {openIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {issue.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-open-dot"></span>
                      {issue.state}
                    </td>
                    <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                    <td>
                      {issue.body
                        ? issue.body.substring(0, 100) + "..."
                        : "No description"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-issues">No open issues yet.</p>
        )}
      </section>

      <section className="issues-section">
        {/* Kapalı issue'ların listesi */}
        <h2 className="issues-section-title">
          Closed Issues ({closedIssues.length})
        </h2>
        {closedIssues.length > 0 ? (
          <div className="issues-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Closing Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {closedIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {issue.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-closed-dot"></span>
                      {issue.state}
                    </td>
                    <td>{new Date(issue.closed_at).toLocaleDateString()}</td>
                    <td>
                      {issue.body
                        ? issue.body.substring(0, 100) + "..."
                        : "No description"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-issues">No closed issues yet.</p>
        )}
      </section>
    </div>
  );
};

export default MergeRequest;
