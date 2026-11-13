import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "35px" }}>
          <h1 style={{ fontSize: "36px", color: "#1e293b" }}>
            Discover Developers
          </h1>

          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Connect with talented developers and explore their skills.
          </p>
        </div>

        {/* Search Box */}
        <div style={{ marginBottom: "35px" }}>
          <input
            type="text"
            placeholder="Search by name, skill or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "16px 20px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Results Heading */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#1e293b" }}>
            {search ? "Search Results" : "All Developers"}
          </h2>

          {!loading && !error && (
            <p style={{ color: "#64748b" }}>
              {developers.length} developers found
            </p>
          )}
        </div>

        {/* Connection Error */}
        {connectionError && (
          <p
            style={{
              color: "#dc2626",
              background: "#fee2e2",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {connectionError}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <h3 style={{ textAlign: "center", color: "#64748b" }}>
            Loading developers...
          </h3>
        )}

        {/* Error */}
        {!loading && error && (
          <p style={{ color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && developers.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>No developers found</h2>
            <p style={{ color: "#64748b" }}>
              Try searching with another name, skill or location.
            </p>
          </div>
        )}

        {/* Developer Cards */}
        {!loading && !error && developers.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "25px",
            }}
          >
            {developers.map((developer) => (
              <div
                key={developer.id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Avatar */}
                <div style={{ textAlign: "center" }}>
                  <img
                    src={
                      developer.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        developer.name
                      )}&background=random`
                    }
                    alt={developer.name}
                    style={{
                      width: "85px",
                      height: "85px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "12px",
                    }}
                  />

                  <h3 style={{ margin: "5px 0", color: "#1e293b" }}>
                    {developer.name}
                  </h3>

                  <p style={{ color: "#64748b", fontSize: "14px" }}>
                    📍 {developer.location || "Location not added"}
                  </p>
                </div>

                {/* Bio */}
                <p
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    minHeight: "45px",
                  }}
                >
                  {developer.bio || "No bio available"}
                </p>

                {/* Skills */}
                <div style={{ marginTop: "15px" }}>
                  <h4 style={{ color: "#334155" }}>Skills</h4>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "7px",
                    }}
                  >
                    {developer.skills.length > 0 ? (
                      developer.skills.map((skill) => (
                        <span
                          key={skill.id}
                          style={{
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            padding: "6px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                          }}
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                        No skills added
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "22px 0",
                    padding: "12px 0",
                    borderTop: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    📁 {developer._count.projects} Projects
                  </span>

                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    📝 {developer._count.blogPosts} Blogs
                  </span>
                </div>

                {/* View Profile */}
                <Link
                  to={`/developers/${developer.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#2563eb",
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  View Profile
                </Link>

                {/* Connect Button */}
                <button
                  onClick={() => handleConnect(developer.id)}
                  disabled={
                    sentRequests.includes(developer.id) ||
                    sendingId === developer.id
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: sentRequests.includes(developer.id)
                      ? "#dcfce7"
                      : "#0f172a",
                    color: sentRequests.includes(developer.id)
                      ? "#15803d"
                      : "white",
                    fontWeight: "600",
                    cursor:
                      sentRequests.includes(developer.id) ||
                      sendingId === developer.id
                        ? "not-allowed"
                        : "pointer",
                    opacity: sendingId === developer.id ? 0.7 : 1,
                  }}
                >
                  {sendingId === developer.id
                    ? "Sending..."
                    : sentRequests.includes(developer.id)
                    ? "Request Sent ✓"
                    : "Connect +"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;