import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBlogs } from "../services/blog.service";
import type { Blog } from "../services/blog.service";
import { useAuth } from "../context/AuthContext";

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
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            DevConnect Blogs
          </h1>

          <p style={{ color: "#666", marginTop: "8px" }}>
            Share your knowledge and learn from developers.
          </p>
        </div>

        <Link
          to="/blogs/create"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + Create Blog
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <h3 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading blogs...
        </h3>
      )}

      {/* Error */}
      {!loading && error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && blogs.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <h2>No blogs available yet!</h2>
          <p>Be the first one to share your knowledge.</p>

          <Link
            to="/blogs/create"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Create your first blog
          </Link>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !error && blogs.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
              }}
            >
              {/* Cover Image */}
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ padding: "20px" }}>
                {/* Status */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: blog.published
                      ? "#dcfce7"
                      : "#fef3c7",
                    color: blog.published
                      ? "#166534"
                      : "#92400e",
                    marginBottom: "12px",
                  }}
                >
                  {blog.published ? "Published" : "Draft"}
                </span>

                {/* Title */}
                <h2
                  style={{
                    fontSize: "21px",
                    margin: "5px 0 10px",
                    color: "#1f2937",
                  }}
                >
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    minHeight: "50px",
                  }}
                >
                  {blog.excerpt ||
                    blog.content.replace(/[#*`>-]/g, "").slice(0, 120) +
                      "..."}
                </p>

                {/* Author */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "15px",
                    marginBottom: "18px",
                  }}
                >
                  {blog.user.avatar ? (
                    <img
                      src={blog.user.avatar}
                      alt={blog.user.name}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        backgroundColor: "#dbeafe",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {blog.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span style={{ color: "#555", fontSize: "14px" }}>
                    {blog.user.name}
                  </span>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to={`/blogs/${blog.slug}`}
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      padding: "9px 15px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Read More
                  </Link>

                  {/* Edit Button - Only Blog Owner */}
                  {user?.id === blog.userId && (
                    <Link
                      to={`/blogs/${blog.slug}/edit`}
                      style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                        padding: "9px 15px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      Edit Blog
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;