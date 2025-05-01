import React, { useState, useEffect } from "react";
import "../styles/PullRequest.css";

const PullRequest = () => {
  // State tanımlamaları: Pull request'ler, yüklenme durumu, hata mesajı, seçili repo ve dropdown durumu
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState("bcicen/ctop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sabit repo listesi: Her repo için isim ve tam GitHub yolu
  const repositories = [
    { name: "ctop", fullName: "bcicen/ctop" },
    { name: "img", fullName: "genuinetools/img" },
  ];

  // Seçili repo değiştiğinde pull request'leri almak için useEffect
  useEffect(() => {
    const fetchPullRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        // GitHub API'den pull request'leri çek
        const response = await fetch(
          `https://api.github.com/repos/${selectedRepo}/pulls?state=all&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `token ${process.env.REACT_APP_GIT_TOKEN}`,
            },
          }
        );

        // HTTP yanıtı başarısızsa hata fırlat
        if (!response.ok)
          throw new Error("API request failed: " + response.status);
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

  // Pull request'leri duruma göre filtrele
  const openPulls = pullRequests.filter((pr) => pr.state === "open");
  const closedPulls = pullRequests.filter((pr) => pr.state === "closed");

  // Dropdown menüsünü aç/kapat
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  // Repo seçildiğinde state'i güncelle ve dropdown'u kapat
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setIsDropdownOpen(false);
  };

  // Dropdown dışındaki tıklamaları izlemek için useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".repo-selector")) {
        setIsDropdownOpen(false);
      }
    };

    // Dokümana tıklama olayını ekle
    document.addEventListener("mousedown", handleClickOutside);

    // Temizlik: Komponent unmount olduğunda eventi kaldır
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="pull-request-container">
      <div className="repo-selector">
        {/* Başlık: Seçili repo adını gösterir ve dropdown'u açar */}
        <h1 className="pull-request-title" onClick={toggleDropdown}>
          {repositories.find((repo) => repo.fullName === selectedRepo)?.name}{" "}
          Pull Requests
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
      {loading && <p className="pull-request-loading">Loading...</p>}
      {/* Hata durumu: API isteği başarısız olursa gösterilir */}
      {error && <p className="pull-request-error">{error}</p>}

      <section className="pulls-section">
        {/* Açık pull request'lerin listesi */}
        <h2 className="pulls-section-title">
          Open Pull Requests ({openPulls.length})
        </h2>
        {openPulls.length > 0 ? (
          <div className="pulls-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Creation Date</th>
                  <th>Source Branch</th>
                  <th>Target Branch</th>
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
                        title={pr.title}
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-open-dot"></span>
                      {pr.state}
                    </td>
                    <td>{new Date(pr.created_at).toLocaleDateString()}</td>
                    <td title={pr.head.ref}>{pr.head.ref}</td>
                    <td title={pr.base.ref}>{pr.base.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-pulls">No open pull requests yet.</p>
        )}
      </section>

      <section className="pulls-section">
        {/* Kapalı pull request'lerin listesi */}
        <h2 className="pulls-section-title">
          Closed Pull Requests ({closedPulls.length})
        </h2>
        {closedPulls.length > 0 ? (
          <div className="pulls-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Closing Date</th>
                  <th>Source Branch</th>
                  <th>Target Branch</th>
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
                        title={pr.title}
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-closed-dot"></span>
                      {pr.state}
                    </td>
                    <td>{new Date(pr.closed_at).toLocaleDateString()}</td>
                    <td title={pr.head.ref}>{pr.head.ref}</td>
                    <td title={pr.base.ref}>{pr.base.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-pulls">No closed pull requests yet.</p>
        )}
      </section>
    </div>
  );
};

export default PullRequest;
