import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getBlogBySlug } from "../services/blog.service";
import type { Blog } from "../services/blog.service";

import "@uiw/react-markdown-preview/markdown.css";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        if (!slug) {
          throw new Error("Invalid blog URL");
        }

        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load blog"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-details-state">
        <div className="blog-details-spinner" />
        <h3>Loading article...</h3>
        <p>Getting the latest story for you.</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-state">
        <div className="blog-error-icon">!</div>
        <h2>{error || "Blog not found"}</h2>
        <p>The article may have been removed or is unavailable.</p>

        <Link to="/blogs" className="blog-back-btn">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="blog-details-page">
      {/* Top Navigation */}
      <div className="article-topbar">
        <Link to="/blogs" className="article-back-link">
          <span>←</span> Back to Blogs
        </Link>

        <span className="article-category">
          DEVCONNECT STORIES
        </span>
      </div>

      {/* Article */}
      <article className="article-wrapper">

        {/* Article Header */}
        <header className="article-header">

          <span className="article-eyebrow">
            DEVELOPER KNOWLEDGE HUB
          </span>

          <h1>{blog.title}</h1>

          {blog.excerpt && (
            <p className="article-excerpt">
              {blog.excerpt}
            </p>
          )}

          {/* Author Information */}
          <div className="article-author">

            <div className="article-author-avatar">
              {blog.user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="article-author-info">
              <strong>{blog.user.name}</strong>
              <span>Community Contributor</span>
            </div>

            <div className="article-meta-divider" />

            <div className="article-date">
              <span>Published on</span>
              <strong>{formattedDate}</strong>
            </div>

          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="article-cover-wrapper">
            <img
            src={blog.coverImage}
            alt={`${blog.title} - Blog cover`}
            className="article-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="article-content-wrapper">

          <div className="article-content-heading">
            <span className="article-content-label">
              THE STORY
            </span>

            <h2>Explore the article</h2>
          </div>

          <div className="article-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

        </div>

        {/* Bottom Section */}
        <footer className="article-footer">
          <div>
            <span className="article-footer-icon">✦</span>
            <h3>Enjoyed this article?</h3>
            <p>
              Keep learning, building and sharing with the DevConnect
              community.
            </p>
          </div>

          <Link to="/blogs" className="article-explore-btn">
            Explore More Articles →
          </Link>
        </footer>

      </article>

      {/* Page Footer */}
      <footer className="article-page-footer">
        Made for developers, built for connections. ✦
      </footer>

    </main>
  );
};

export default BlogDetails;