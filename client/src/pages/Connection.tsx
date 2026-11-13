import { useEffect, useState } from "react";
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

  const loadConnections = async () => {
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
  };

  useEffect(() => {
    loadConnections();
  }, []);

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
        err instanceof Error ? err.message : "Failed to accept request"
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
        err instanceof Error ? err.message : "Failed to reject request"
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flex: 1,
      }}
    >
      <img
        src={getAvatar(developer)}
        alt={developer.name}
        style={{
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <div>
        <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>
          {developer.name}
        </h3>

        <p style={{ margin: "0 0 5px", color: "#64748b", fontSize: "14px" }}>
          {developer.bio || "Developer on DevConnect"}
        </p>

        <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
          📍 {developer.location || "Location not added"}
        </p>
      </div>
    </div>
  );

  const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "15px",
  };

  const buttonStyle: React.CSSProperties = {
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ color: "#1e293b", fontSize: "34px" }}>
            My Connections
          </h1>

          <p style={{ color: "#64748b" }}>
            Manage your developer network and connection requests.
          </p>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          {[
            { label: "Received Requests", count: receivedRequests.length },
            { label: "Sent Requests", count: sentRequests.length },
            { label: "My Connections", count: connections.length },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "white",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ color: "#2563eb", margin: 0 }}>
                {item.count}
              </h2>

              <p style={{ color: "#64748b", marginBottom: 0 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          {[
            { id: "received", label: "Received Requests" },
            { id: "sent", label: "Sent Requests" },
            { id: "connections", label: "My Connections" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              style={{
                padding: "12px 18px",
                borderRadius: "8px",
                border: "none",
                background:
                  activeTab === tab.id ? "#2563eb" : "#e2e8f0",
                color: activeTab === tab.id ? "white" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <button
            onClick={loadConnections}
            disabled={loading}
            style={{
              ...buttonStyle,
              background: "#e0e7ff",
              color: "#3730a3",
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Messages */}
        {message && (
          <p
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {error}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <h3 style={{ textAlign: "center", color: "#64748b" }}>
            Loading connections...
          </h3>
        ) : (
          <>
            {/* Received Requests */}
            {activeTab === "received" && (
              <>
                {receivedRequests.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b" }}>
                    No pending connection requests.
                  </p>
                ) : (
                  receivedRequests.map((request) => (
                    <div key={request.id} style={cardStyle}>
                      {renderDeveloper(request.requester)}

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => handleAccept(request.id)}
                          disabled={actionLoading === request.id}
                          style={{
                            ...buttonStyle,
                            background: "#16a34a",
                            color: "white",
                          }}
                        >
                          {actionLoading === request.id
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading === request.id}
                          style={{
                            ...buttonStyle,
                            background: "#fee2e2",
                            color: "#b91c1c",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Sent Requests */}
            {activeTab === "sent" && (
              <>
                {sentRequests.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b" }}>
                    You have not sent any pending requests.
                  </p>
                ) : (
                  sentRequests.map((request) => (
                    <div key={request.id} style={cardStyle}>
                      {renderDeveloper(request.receiver)}

                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "9px 15px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        ⏳ Pending
                      </span>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Accepted Connections */}
            {activeTab === "connections" && (
              <>
                {connections.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b" }}>
                    You have no connections yet.
                  </p>
                ) : (
                  connections.map((connection) => (
                    <div key={connection.id} style={cardStyle}>
                      {renderDeveloper(connection.developer)}

                      <span
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          padding: "9px 15px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Connected
                      </span>
                    </div>
                  ))
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Connections;