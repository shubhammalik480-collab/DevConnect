import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Developers.css";

import {
  getDevelopers,
  sendConnectionRequest,
  type Developer,
} from "../services/developer.service";

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState("");

  const fetchDevelopers = useCallback(async () => {
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
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDevelopers();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [fetchDevelopers]);

  const handleConnect = async (developerId: string) => {
    try {
      setSendingId(developerId);
      setConnectionError("");

      await sendConnectionRequest(developerId);

      setSentRequests((previous) => [
        ...previous,
        developerId,
      ]);
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
    <main className="developers-container">
      <div className="developers-content">

        {/* Header */}
        <header className="developers-header">
          <h1>Discover Developers</h1>
          <p>
            Connect with talented developers and grow your network.
          </p>
        </header>

        {/* Search */}
        <div className="developers-search">
          <input
            type="text"
            placeholder="Search developers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Messages */}
        {connectionError && (
          <p className="developers-message section-error">
            {connectionError}
          </p>
        )}

        {error && (
          <p className="developers-message section-error">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <p className="developers-message">
            Loading developers...
          </p>
        ) : developers.length === 0 ? (
          <p className="developers-message">
            No developers found.
          </p>
        ) : (
          <>
            <div className="developers-results">
              <h2>Developers</h2>
              <p>{developers.length} developers found</p>
            </div>

            {/* Developer Cards */}
            <div className="developers-grid">
              {developers.map((developer) => (
                <article
                  key={developer.id}
                  className="developer-card"
                >

                  {/* Developer Information */}
                  <div className="developer-info">

                    <img
                      src={
                        developer.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          developer.name
                        )}&background=random`
                      }
                      alt={developer.name}
                      className="developer-avatar"
                    />

                    <h3>{developer.name}</h3>

                    <p className="developer-bio">
                      {developer.bio || "Developer on DevConnect"}
                    </p>

                    <p className="developer-location">
                      📍 {developer.location || "Location not added"}
                    </p>

                  </div>

                  {/* Skills */}
                  <div className="developer-skills">
                    {developer.skills?.map((skill) => (
                      <span
                        key={skill.id}
                        className="developer-skill"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Statistics */}
                  <div className="developer-stats">
                    <span>
                      Projects: {developer._count?.projects ?? 0}
                    </span>

                    {" | "}

                    <span>
                      Blogs: {developer._count?.blogPosts ?? 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="developer-actions">

                    <Link
                      to={`/developers/${developer.id}`}
                      className="view-profile-btn"
                    >
                      View Profile
                    </Link>

                    <button
                      className="connect-btn"
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
          </>
        )}

      </div>
    </main>
  );
};

export default Developers;