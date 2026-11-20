import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBlogs } from "../services/blog.service";
import type { Blog } from "../services/blog.service";
import { useAuth } from "../context/useAuth";

import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBlogs();
        setBlogs(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchBlogs();
  }, []);

  const publishedBlogs = blogs.filter((blog) => blog.published);
  const myBlogs = blogs.filter((blog) => blog.userId === user?.id);

  return (
    <main className="blogs-page">
      <div className="blogs-content">

        {/* Hero Section */}
        <section className="blogs-hero">
          <div className="blogs-hero-content">
            <span className="blogs-eyebrow">
              DEVELOPER KNOWLEDGE HUB
            </span>

            <h1>Ideas worth sharing.</h1>

            <p>
              Discover insights, share your experience and learn
              something new from developers around the world.
            </p>

            <div className="blogs-hero-actions">
              <Link
                to="/blogs/create"
                className="blogs-primary-btn"
              >
                + Write an Article
              </Link>

              <span className="blogs-hero-note">
                Learn. Build. Share.
              </span>
            </div>
          </div>

          <div className="blogs-hero-decoration">
            {"</>"}
          </div>
        </section>

        {/* Blog Statistics */}
        <section className="blogs-stats">
          <div className="blogs-stat-card">
            <span className="blogs-stat-icon">📚</span>
            <div>
              <strong>{blogs.length}</strong>
              <span>Total Articles</span>
            </div>
          </div>

          <div className="blogs-stat-card">
            <span className="blogs-stat-icon">✦</span>
            <div>
              <strong>{publishedBlogs.length}</strong>
              <span>Published</span>
            </div>
          </div>

          <div className="blogs-stat-card">
            <span className="blogs-stat-icon">✍️</span>
            <div>
              <strong>{myBlogs.length}</strong>
              <span>Your Articles</span>
            </div>
          </div>
        </section>

        {/* Section Heading */}
        <header className="blogs-section-header">
          <div>
            <span className="blogs-eyebrow">
              EXPLORE KNOWLEDGE
            </span>

            <h2>Latest from the community</h2>

            <p>
              Fresh ideas and experiences shared by developers.
            </p>
          </div>

          <Link
            to="/blogs/create"
            className="blogs-create-link"
          >
            Create Blog +
          </Link>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="blogs-state">
            <div className="blogs-spinner" />
            <h3>Discovering great ideas...</h3>
            <p>Loading articles from the community.</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="blogs-state blogs-error-state">
            <span>!</span>
            <h3>Unable to load articles</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="blogs-state blogs-empty">
            <span className="blogs-empty-icon">✍️</span>

            <h2>No articles published yet</h2>

            <p>
              Be the first developer to share knowledge
              with the DevConnect community.
            </p>

            <Link
              to="/blogs/create"
              className="blogs-primary-btn"
            >
              Create Your First Blog
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="blogs-grid">

            {blogs.map((blog) => (
              <article className="blog-card" key={blog.id}>

                {/* Cover Image */}
                <div className="blog-card-cover">
                  {blog.coverImage ? (
                    <img
                    src={blog.coverImage}
                    alt={`${blog.title} - Blog cover`}
                    loading="lazy"
                    decoding="async"
                      />
                  ) : (
                    <div className="blog-cover-placeholder">
                      <span>{"</>"}</span>
                      <small>DEVCONNECT STORIES</small>
                    </div>
                  )}

                  <span
                    className={`blog-status ${
                      blog.published
                        ? "published"
                        : "draft"
                    }`}
                  >
                    {blog.published ? "● Published" : "● Draft"}
                  </span>
                </div>

                {/* Blog Content */}
                <div className="blog-content">

                  <span className="blog-category">
                    DEVELOPER ARTICLE
                  </span>

                  <h2 className="blog-title">
                    {blog.title}
                  </h2>

                  <p className="blog-excerpt">
                    {blog.excerpt ||
                      blog.content
                        .replace(/[#*`>-]/g, "")
                        .slice(0, 140) + "..."}
                  </p>

                  {/* Author */}
                  <div className="blog-author">

                    {blog.user.avatar ? (
                      <img
                      src={blog.user.avatar}
                      alt={`${blog.user.name} profile`}
                      loading="lazy"
                      decoding="async"
                        />
                    ) : (
                      <div className="blog-author-placeholder">
                        {blog.user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="blog-author-info">
                      <strong>{blog.user.name}</strong>
                      <span>Community Contributor</span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="blog-actions">

                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="read-blog-btn"
                    >
                      Read Article →
                    </Link>

                    {user?.id === blog.userId && (
                      <Link
                        to={`/blogs/${blog.slug}/edit`}
                        className="edit-blog-btn"
                      >
                        Edit
                      </Link>
                    )}

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

        {/* Footer */}
        <footer className="blogs-footer">
          Made for developers, built for connections. ✦
        </footer>

      </div>
    </main>
  );
};

export default Blogs;