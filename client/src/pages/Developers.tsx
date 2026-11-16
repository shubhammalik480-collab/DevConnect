import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DeveloperProfile.css";
import {
  getDevelopers,
  sendConnectionRequest,
  type Developer,
} from "../services/developer.service";

import "./Developers.css";

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevelopers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDevelopers(search);
      setDevelopers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load developers"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (developerId: string) => {
    try {
      setSendingId(developerId);
      setConnectionError("");

      await sendConnectionRequest(developerId);

      setSentRequests((previous) => [...previous, developerId]);
    } catch (err) {
      setConnectionError(
        err instanceof Error
          ? err.message
          : "Failed to send connection request"
      );
    } finally {
      setSendingId(null);
    }
  };

  return (
    <main className="developers-page">
      <div className="developers-container">

        <header className="developers-header">
          <h1>Discover Developers</h1>
          <p>
            Connect with talented developers and explore their skills.
          </p>
        </header>

        <div className="developers-search">
          <input
            type="text"
            placeholder="Search by name, skill or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search developers"
          />
        </div>

        <section className="developers-results">
          <div className="developers-results-header">
            <h2>{search ? "Search Results" : "All Developers"}</h2>

            {!loading && !error && (
              <p>{developers.length} developers found</p>
            )}
          </div>

          {connectionError && (
            <p className="connection-error">
              {connectionError}
            </p>
          )}

          {loading && (
            <h3 className="developers-message">
              Loading developers...
            </h3>
          )}

          {!loading && error && (
            <p className="developers-error">{error}</p>
          )}

          {!loading && !error && developers.length === 0 && (
            <div className="developers-empty">
              <h2>No developers found</h2>
              <p>
                Try searching with another name, skill or location.
              </p>
            </div>
          )}

          {!loading && !error && developers.length > 0 && (
            <div className="developers-grid">
              {developers.map((developer) => (
                <article
                  className="developer-card"
                  key={developer.id}
                >
                  <div className="developer-profile">
                    <img
                      className="developer-avatar"
                      src={
                        developer.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          developer.name
                        )}&background=random`
                      }
                      alt={developer.name}
                    />

                    <h3>{developer.name}</h3>

                    <p className="developer-location">
                      📍 {developer.location || "Location not added"}
                    </p>
                  </div>

                  <p className="developer-bio">
                    {developer.bio || "No bio available"}
                  </p>

                  <div className="developer-skills">
                    <h4>Skills</h4>

                    <div className="developer-skill-tags">
                      {developer.skills.length > 0 ? (
                        developer.skills.map((skill) => (
                          <span key={skill.id}>
                            {skill.name}
                          </span>
                        ))
                      ) : (
                        <span className="no-skills">
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="developer-stats">
                    <span>
                      📁 {developer._count.projects} Projects
                    </span>
                  </div>

                  <div className="developer-actions">
                    <Link
                      to={`/developers/${developer.id}`}
                      className="view-profile-btn"
                    >
                      View Profile
                    </Link>

                    <button
                      className={`connect-btn ${
                        sentRequests.includes(developer.id)
                          ? "request-sent"
                          : ""
                      }`}
                      onClick={() => handleConnect(developer.id)}
                      disabled={
                        sentRequests.includes(developer.id) ||
                        sendingId === developer.id
                      }
                    >
                      {sendingId === developer.id
                        ? "Sending..."
                        : sentRequests.includes(developer.id)
                          ? "Request Sent ✓"
                          : "Connect +"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Developers;