import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import {
  getDashboardStats,
  type DashboardStats,
} from "../services/dashboard.service";

import {
  getActivities,
  type Activity,
} from "../services/activity.service";

import {
  getDevelopers,
  type Developer,
} from "../services/developer.service";

import {
  getBlogs,
  type Blog,
} from "../services/blog.service";

import {
  getMyConnections,
  getPendingRequests,
  getSentRequests,
} from "../services/connection.service";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Logout Handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statsData,
          activityData,
          developerData,
          blogData,
          acceptedConnections,
          receivedRequests,
          sentRequests,
        ] = await Promise.all([
          getDashboardStats(),
          getActivities(),
          getDevelopers(),
          getBlogs(),
          getMyConnections(),
          getPendingRequests(),
          getSentRequests(),
        ]);

        setStats(statsData);
        setActivities(activityData);

        // Exclude existing connections and pending requests
        const excludedIds = new Set<string>();

        acceptedConnections.forEach((connection) => {
          excludedIds.add(connection.developer.id);
        });

        receivedRequests.forEach((request) => {
          excludedIds.add(request.requester.id);
        });

        sentRequests.forEach((request) => {
          excludedIds.add(request.receiver.id);
        });

        const suggestions = developerData.filter(
          (developer) => !excludedIds.has(developer.id)
        );

        setDevelopers(suggestions.slice(0, 4));

        // Show only published blogs
        setBlogs(
          blogData.filter((blog) => blog.published).slice(0, 3)
        );
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner" />
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Dashboard Statistics
  const statCards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects ?? 0,
      icon: "💻",
      color: "purple",
    },
    {
      title: "Total Skills",
      value: stats?.totalSkills ?? 0,
      icon: "⚡",
      color: "orange",
    },
    {
      title: "Blog Posts",
      value: stats?.totalBlogs ?? 0,
      icon: "📝",
      color: "blue",
    },
    {
      title: "Connections",
      value: stats?.totalConnections ?? 0,
      icon: "🤝",
      color: "green",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-logo">
          Dev<span>Connect</span>.
        </Link>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-item active">
            <span>⌂</span> Dashboard
          </Link>

          <Link to="/" className="nav-item">
            <span>◉</span> My Profile
          </Link>

          <Link to="/developers" className="nav-item">
            <span>♧</span> Discover Developers
          </Link>

          <Link to="/connections" className="nav-item">
            <span>♧</span> Connections
          </Link>

          <Link to="/blogs" className="nav-item">
            <span>▤</span> Blogs
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-community-card">
            <span>✦</span>
            <h3>Keep growing!</h3>
            <p>
              Connect, collaborate and build something amazing.
            </p>
            <Link to="/developers">
              Explore community →
            </Link>
          </div>

          <p className="sidebar-copyright">
            © 2026 DevConnect
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-eyebrow">
              YOUR WORKSPACE
            </span>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-topbar-actions">
            <Link to="/developers" className="topbar-action">
              + Find Developers
            </Link>

            <button
              className="dashboard-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "↪ Logout"}
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="dashboard-welcome">
          <div>
            <span className="welcome-tag">
              YOUR DEVELOPER COMMUNITY
            </span>

            <h2>Welcome back! 👋</h2>

            <p>
              Your next opportunity could start with a connection.
              Explore what's happening in your community.
            </p>
          </div>

          <div className="welcome-decoration">
            {"</>"}
          </div>
        </section>

        {/* Statistics */}
        <section className="dashboard-stats">
          {statCards.map((card) => (
            <div className="stat-card" key={card.title}>
              <div className={`stat-card-icon ${card.color}`}>
                {card.icon}
              </div>

              <div>
                <h3>{card.value}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Activity Feed */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                COMMUNITY UPDATES
              </span>
              <h2>Recent Activity</h2>
            </div>

            <span className="section-count">
              {activities.length} updates
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="dashboard-empty">
              <div>✦</div>
              <h3>Your feed is just getting started</h3>

              <p>
                Connect with developers to see their latest activities here.
              </p>

              <Link to="/developers">
                Discover developers →
              </Link>
            </div>
          ) : (
            <div className="activity-list">
              {activities.map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-avatar">
                    {activity.actor.avatar ? (
                      <img
                        src={activity.actor.avatar}
                        alt={activity.actor.name}
                      />
                    ) : (
                      activity.actor.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="activity-content">
                    <p>
                      <strong>{activity.actor.name}</strong>{" "}
                      {activity.message}
                    </p>

                    <span>
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Developer Suggestions */}
        <section className="dashboard-section dashboard-extra-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                BUILD YOUR NETWORK
              </span>
              <h2>People you may know</h2>
            </div>

            <Link to="/developers">
              View all →
            </Link>
          </div>

          {developers.length === 0 ? (
            <div className="dashboard-empty">
              <p>No new developer suggestions available.</p>
            </div>
          ) : (
            <div className="dashboard-developer-grid">
              {developers.map((developer) => (
                <div
                  className="dashboard-developer-card"
                  key={developer.id}
                >
                  <img
                    src={
                      developer.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        developer.name
                      )}&background=random`
                    }
                    alt={developer.name}
                  />

                  <h3>{developer.name}</h3>

                  <p>
                    {developer.location || "Developer"}
                  </p>

                  <Link to={`/developers/${developer.id}`}>
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Blogs */}
        <section className="dashboard-section dashboard-extra-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                LEARN & SHARE
              </span>
              <h2>Latest from the community</h2>
            </div>

            <Link to="/blogs">
              Explore blogs →
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="dashboard-empty">
              <p>No published blog posts available.</p>
            </div>
          ) : (
            <div className="dashboard-blog-grid">
              {blogs.map((blog) => (
                <article
                  className="dashboard-blog-card"
                  key={blog.id}
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                    />
                  )}

                  <div className="dashboard-blog-content">
                    <span className="blog-author">
                      By {blog.user.name}
                    </span>

                    <h3>{blog.title}</h3>

                    <p>
                      {blog.excerpt ||
                        blog.content.slice(0, 100) + "..."}
                    </p>

                    <Link to={`/blogs/${blog.slug}`}>
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          Made for developers, built for connections. ✦
        </footer>

      </main>

      {/* Right Sidebar */}
      <aside className="dashboard-rightbar">

        <div className="rightbar-card">
          <span className="rightbar-label">
            NETWORKING
          </span>

          <h3>Grow your network</h3>

          <p>
            Meet developers, exchange ideas and discover new opportunities.
          </p>

          <Link to="/developers">
            Find people →
          </Link>
        </div>

        <div className="rightbar-card">
          <div className="rightbar-heading">
            <h3>Suggested developers</h3>
            <Link to="/developers">See all</Link>
          </div>

          {developers.length === 0 ? (
            <p className="rightbar-empty">
              No suggestions yet.
            </p>
          ) : (
            developers.slice(0, 3).map((developer) => (
              <div
                className="rightbar-developer"
                key={developer.id}
              >
                <img
                  src={
                    developer.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      developer.name
                    )}&background=random`
                  }
                  alt={developer.name}
                />

                <div>
                  <strong>{developer.name}</strong>
                  <span>
                    {developer.location || "Developer"}
                  </span>
                </div>

                <Link
                  to={`/developers/${developer.id}`}
                  aria-label={`View ${developer.name}'s profile`}
                >
                  →
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="rightbar-card rightbar-tips">
          <span>💡 COMMUNITY TIP</span>

          <h3>Build in public.</h3>

          <p>
            Share what you're learning, showcase your projects and
            engage with other developers.
          </p>

          <Link to="/blogs">
            Explore community blogs →
          </Link>
        </div>

      </aside>
    </div>
  );
};

export default Dashboard;