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

  return (
    <main className="connections-page">
      <div className="connections-container">
        <header className="connections-header">
          <h1>My Connections</h1>
          <p>
            Manage your developer network and connection requests.
          </p>
        </header>

        <section className="connections-stats">
          {[
            {
              label: "Received Requests",
              count: receivedRequests.length,
            },
            {
              label: "Sent Requests",
              count: sentRequests.length,
            },
            {
              label: "My Connections",
              count: connections.length,
            },
          ].map((item) => (
            <div className="connection-stat-card" key={item.label}>
              <h2>{item.count}</h2>
              <p>{item.label}</p>
            </div>
          ))}
        </section>

        <div className="connections-tabs">
          {[
            { id: "received", label: "Received Requests" },
            { id: "sent", label: "Sent Requests" },
            { id: "connections", label: "My Connections" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={
                activeTab === tab.id
                  ? "connection-tab active"
                  : "connection-tab"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="connections-refresh">
          <button
            onClick={() => void loadConnections()}
            disabled={loading}
            className="refresh-btn"
          >
            ↻ Refresh
          </button>
        </div>

        {message && (
          <p className="connection-success">{message}</p>
        )}

        {error && (
          <p className="connection-error">{error}</p>
        )}

        {loading ? (
          <h3 className="connections-message">
            Loading connections...
          </h3>
        ) : (
          <section className="connections-list">
            {activeTab === "received" && (
              <>
                {receivedRequests.length === 0 ? (
                  <p className="connections-empty">
                    No pending connection requests.
                  </p>
                ) : (
                  receivedRequests.map((request) => (
                    <article
                      key={request.id}
                      className="connection-card"
                    >
                      {renderDeveloper(request.requester)}

                      <div className="connection-actions">
                        <button
                          onClick={() => handleAccept(request.id)}
                          disabled={actionLoading === request.id}
                          className="accept-btn"
                        >
                          {actionLoading === request.id
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading === request.id}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </>
            )}

            {activeTab === "sent" && (
              <>
                {sentRequests.length === 0 ? (
                  <p className="connections-empty">
                    You have not sent any pending requests.
                  </p>
                ) : (
                  sentRequests.map((request) => (
                    <article
                      key={request.id}
                      className="connection-card"
                    >
                      {renderDeveloper(request.receiver)}

                      <span className="connection-status pending">
                        ⏳ Pending
                      </span>
                    </article>
                  ))
                )}
              </>
            )}

            {activeTab === "connections" && (
              <>
                {connections.length === 0 ? (
                  <p className="connections-empty">
                    You have no connections yet.
                  </p>
                ) : (
                  connections.map((connection) => (
                    <article
                      key={connection.id}
                      className="connection-card"
                    >
                      {renderDeveloper(connection.developer)}

                      <span className="connection-status connected">
                        ✓ Connected
                      </span>
                    </article>
                  ))
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Connections;