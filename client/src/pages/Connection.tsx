import { useCallback, useEffect, useState } from "react";

import {
  getPendingRequests,
  getSentRequests,
  getMyConnections,
  acceptConnectionRequest,
  rejectConnectionRequest,
  type ConnectionRequest,
  type AcceptedConnection,
  type ConnectionDeveloper,
} from "../services/connection.service";

import "./Connection.css";

type Tab = "received" | "sent" | "connections";

const Connections = () => {
  const [activeTab, setActiveTab] = useState<Tab>("received");

  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [connections, setConnections] = useState<AcceptedConnection[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [received, sent, accepted] = await Promise.all([
        getPendingRequests(),
        getSentRequests(),
        getMyConnections(),
      ]);

      setReceivedRequests(received);
      setSentRequests(sent);
      setConnections(accepted);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load connections"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConnections();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadConnections]);

  const handleAccept = async (id: string) => {
    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      await acceptConnectionRequest(id);

      setMessage("Connection request accepted successfully!");
      await loadConnections();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to accept request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      await rejectConnectionRequest(id);

      setMessage("Connection request rejected.");
      await loadConnections();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getAvatar = (developer: ConnectionDeveloper) => {
    return (
      developer.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        developer.name
      )}&background=random`
    );
  };

  const renderDeveloper = (developer: ConnectionDeveloper) => (
    <div className="connection-developer">
      <img
        src={getAvatar(developer)}
        alt={developer.name}
        className="connection-avatar"
      />

      <div className="connection-developer-info">
        <h3>{developer.name}</h3>

        <p className="connection-bio">
          {developer.bio || "Developer on DevConnect"}
        </p>

        <p className="connection-location">
          📍 {developer.location || "Location not added"}
        </p>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: string; count: number }[] = [
    {
      id: "received",
      label: "Received Requests",
      icon: "📩",
      count: receivedRequests.length,
    },
    {
      id: "sent",
      label: "Sent Requests",
      icon: "📤",
      count: sentRequests.length,
    },
    {
      id: "connections",
      label: "My Connections",
      icon: "🤝",
      count: connections.length,
    },
  ];

  return (
    <main className="connections-page">
      <div className="connections-container">

        {/* Hero Section */}
        <header className="connections-hero">
          <div>
            <span className="connections-eyebrow">
              YOUR PROFESSIONAL NETWORK
            </span>

            <h1>My Connections</h1>

            <p>
              Build meaningful relationships, connect with developers
              and grow together.
            </p>
          </div>

          <div className="connections-hero-decoration">
            {"</>"}
          </div>
        </header>

        {/* Statistics */}
        <section className="connections-stats">

          <div className="connection-stat-card">
            <div className="stat-icon received-icon">📩</div>
            <div>
              <h2>{receivedRequests.length}</h2>
              <p>Received Requests</p>
            </div>
          </div>

          <div className="connection-stat-card">
            <div className="stat-icon sent-icon">📤</div>
            <div>
              <h2>{sentRequests.length}</h2>
              <p>Sent Requests</p>
            </div>
          </div>

          <div className="connection-stat-card">
            <div className="stat-icon connected-icon">🤝</div>
            <div>
              <h2>{connections.length}</h2>
              <p>My Connections</p>
            </div>
          </div>

        </section>

        {/* Main Content */}
        <section className="connections-content">

          <div className="connections-section-header">
            <div>
              <span className="section-eyebrow">
                NETWORK MANAGEMENT
              </span>

              <h2>Manage your network</h2>

              <p>
                View and manage all your connection activities.
              </p>
            </div>

            <button
              onClick={() => void loadConnections()}
              disabled={loading}
              className="refresh-btn"
            >
              ↻ {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Tabs */}
          <div className="connections-tabs" role="tablist">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? "connection-tab active"
                    : "connection-tab"
                }
              >
                <span>{tab.icon}</span>
                {tab.label}

                <span className="tab-count">
                  {tab.count}
                </span>
              </button>
            ))}

          </div>

          {/* Notifications */}
          {message && (
            <div className="connection-success">
              <span>✓</span>
              {message}
            </div>
          )}

          {error && (
            <div className="connection-error">
              <span>!</span>
              {error}
            </div>
          )}

          {/* Connection List */}
          {loading ? (
            <div className="connections-loading">
              <div className="connections-spinner" />
              <h3>Loading your network...</h3>
              <p>Please wait while we fetch your connections.</p>
            </div>
          ) : (
            <div className="connections-list">

              {/* Received Requests */}
              {activeTab === "received" && (
                receivedRequests.length === 0 ? (
                  <div className="connections-empty">
                    <div className="empty-icon">📩</div>
                    <h3>No pending requests</h3>
                    <p>
                      When developers send you connection requests,
                      they will appear here.
                    </p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <article
                      key={request.id}
                      className="connection-card"
                    >
                      <div className="connection-card-main">
                        {renderDeveloper(request.requester)}

                        <span className="connection-status pending">
                          ● Pending Request
                        </span>
                      </div>

                      <div className="connection-actions">
                        <button
                          onClick={() => handleAccept(request.id)}
                          disabled={actionLoading !== null}
                          className="accept-btn"
                        >
                          {actionLoading === request.id
                            ? "Processing..."
                            : "✓ Accept"}
                        </button>

                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading !== null}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  ))
                )
              )}

              {/* Sent Requests */}
              {activeTab === "sent" && (
                sentRequests.length === 0 ? (
                  <div className="connections-empty">
                    <div className="empty-icon">📤</div>
                    <h3>No sent requests</h3>
                    <p>
                      Connection requests you send to developers
                      will appear here.
                    </p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <article
                      key={request.id}
                      className="connection-card"
                    >
                      <div className="connection-card-main">
                        {renderDeveloper(request.receiver)}

                        <span className="connection-status pending">
                          ⏳ Awaiting Response
                        </span>
                      </div>
                    </article>
                  ))
                )
              )}

              {/* Accepted Connections */}
              {activeTab === "connections" && (
                connections.length === 0 ? (
                  <div className="connections-empty">
                    <div className="empty-icon">🤝</div>
                    <h3>Your network starts here!</h3>
                    <p>
                      Discover developers and build your professional
                      network on DevConnect.
                    </p>
                  </div>
                ) : (
                  connections.map((connection) => (
                    <article
                      key={connection.id}
                      className="connection-card"
                    >
                      <div className="connection-card-main">
                        {renderDeveloper(connection.developer)}

                        <span className="connection-status connected">
                          ✓ Connected
                        </span>
                      </div>
                    </article>
                  ))
                )
              )}

            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="connections-footer">
          Made for developers, built for connections. ✦
        </footer>

      </div>
    </main>
  );
};

export default Connections;