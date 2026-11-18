import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // Dashboard Statistics
        setStats(statsData);

        // Recent Activities
        setActivities(activityData);

        // Exclude already connected developers
        const excludedIds = new Set<string>();

        acceptedConnections.forEach((connection) => {
          excludedIds.add(connection.developer.id);
        });

        // Exclude developers who sent us a request
        receivedRequests.forEach((request) => {
          excludedIds.add(request.requester.id);
        });

        // Exclude developers to whom we sent a request
        sentRequests.forEach((request) => {
          excludedIds.add(request.receiver.id);
        });

        // Filter new developer suggestions
        const suggestions = developerData.filter(
          (developer) => !excludedIds.has(developer.id)
        );

        setDevelopers(suggestions.slice(0, 4));

        // Latest Published Blogs
        setBlogs(
          blogData
            .filter((blog) => blog.published)
            .slice(0, 4)
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects ?? 0,
      icon: "💻",
    },
    {
      title: "Total Skills",
      value: stats?.totalSkills ?? 0,
      icon: "⚡",
    },
    {
      title: "Blog Posts",
      value: stats?.totalBlogs ?? 0,
      icon: "📝",
    },
    {
      title: "Connections",
      value: stats?.totalConnections ?? 0,
      icon: "🤝",
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      icon: "📩",
    },
  ];

  return (
    <div className="dashboard-container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening in your DevConnect community.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <section className="dashboard-stats">
        {statCards.map((card) => (
          <div className="stat-card" key={card.title}>
            <div className="stat-card-icon">
              {card.icon}
            </div>

            <div>
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Recent Activity</h2>
          <span>Your latest updates</span>
        </div>

        {activities.length === 0 ? (
          <div className="dashboard-empty">
            <p>No recent activities yet.</p>
            <span>
              Connect with developers and endorse skills to see updates here.
            </span>
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
          <h2>Developers You May Know</h2>
          <Link to="/developers">View All</Link>
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
                  {developer.location || "Location not specified"}
                </p>

                <Link to={`/developers/${developer.id}`}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Blog Posts */}
      <section className="dashboard-section dashboard-extra-section">
        <div className="section-heading">
          <h2>Latest Blog Posts</h2>
          <Link to="/blogs">View All</Link>
        </div>

        {blogs.length === 0 ? (
          <div className="dashboard-empty">
            <p>No published blog posts available.</p>
          </div>
        ) : (
          <div className="dashboard-blog-grid">
            {blogs.map((blog) => (
              <div
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
                  <h3>{blog.title}</h3>

                  <p>
                    {blog.excerpt ||
                      blog.content.slice(0, 100) + "..."}
                  </p>

                  <span>
                    By {blog.user.name}
                  </span>

                  <Link to={`/blogs/${blog.slug}`}>
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;