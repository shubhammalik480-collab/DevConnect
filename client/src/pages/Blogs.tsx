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
          err instanceof Error ? err.message : "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="blogs-container">
      {/* Header */}
      <header className="blogs-header">
        <div>
          <h1>DevConnect Blogs</h1>
          <p>Share your knowledge and learn from developers.</p>
        </div>

        <Link to="/blogs/create" className="create-blog-btn">
          + Create Blog
        </Link>
      </header>

      {/* Loading */}
      {loading && (
        <h3 className="blogs-message">Loading blogs...</h3>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="blogs-error">{error}</p>
      )}

      {/* Empty State */}
      {!loading && !error && blogs.length === 0 && (
        <div className="blogs-empty">
          <h2>No blogs available yet!</h2>
          <p>Be the first one to share your knowledge.</p>

          <Link to="/blogs/create">
            Create your first blog
          </Link>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !error && blogs.length > 0 && (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog.id}>
              {blog.coverImage && (
                <img
                  className="blog-cover"
                  src={blog.coverImage}
                  alt={blog.title}
                />
              )}

              <div className="blog-content">
                <span
                  className={`blog-status ${
                    blog.published ? "published" : "draft"
                  }`}
                >
                  {blog.published ? "Published" : "Draft"}
                </span>

                <h2 className="blog-title">{blog.title}</h2>

                <p className="blog-excerpt">
                  {blog.excerpt ||
                    blog.content.replace(/[#*`>-]/g, "").slice(0, 120) +
                      "..."}
                </p>

                {/* Author */}
                <div className="blog-author">
                  {blog.user.avatar ? (
                    <img
                      src={blog.user.avatar}
                      alt={blog.user.name}
                    />
                  ) : (
                    <div className="blog-author-placeholder">
                      {blog.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span>{blog.user.name}</span>
                </div>

                {/* Actions */}
                <div className="blog-actions">
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="read-blog-btn"
                  >
                    Read More
                  </Link>

                  {user?.id === blog.userId && (
                    <Link
                      to={`/blogs/${blog.slug}/edit`}
                      className="edit-blog-btn"
                    >
                      Edit Blog
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Blogs;