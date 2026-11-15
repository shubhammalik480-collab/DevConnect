import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import "./Navbar.css";

const Navbar = () => {
  const { logout } = useAuth();

  const { notifications, clearNotifications } = useSocket();

  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications((previous) => !previous);
  };

  const handleClearNotifications = () => {
    clearNotifications();
  };

  return (
    <nav className="main-navbar">
      <Link to="/" className="navbar-brand">
        DevConnect
      </Link>

      <div className="navbar-links">
        <Link to="/">Profile</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/developers">Developers</Link>
        <Link to="/connections">Connections</Link>

        {/* Notification Bell */}
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            🔔

            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length > 99
                  ? "99+"
                  : notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>

                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications}>
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="no-notifications">
                  No notifications yet.
                </p>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      className="notification-item"
                      key={notification.id}
                    >
                      <p>{notification.message}</p>

                      <small>
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;