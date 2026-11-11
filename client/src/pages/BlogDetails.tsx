import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  getBlogBySlug,
} from "../services/blog.service";

import type { Blog } from "../services/blog.service";

import "@uiw/react-markdown-preview/markdown.css";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) {
          throw new Error("Invalid blog URL");
        }

        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load blog"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading blog...</h2>;
  }

  if (error || !blog) {
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>
        <h2>{error || "Blog not found"}</h2>
        <Link to="/blogs">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "25px",
      }}
    >
      <Link
        to="/blogs"
        style={{
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ← Back to Blogs
      </Link>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "12px",
            marginTop: "25px",
          }}
        />
      )}

      <header style={{ marginTop: "30px" }}>
        <h1 style={{ fontSize: "36px", color: "#0f172a" }}>
          {blog.title}
        </h1>

        <p style={{ color: "#64748b", marginTop: "12px" }}>
          By {blog.user.name}
        </p>

        <p style={{ color: "#64748b", fontSize: "14px" }}>
          {new Date(blog.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {blog.excerpt && (
        <p
          style={{
            fontSize: "18px",
            color: "#475569",
            lineHeight: "1.7",
            marginTop: "25px",
          }}
        >
          {blog.excerpt}
        </p>
      )}

      <article
        style={{
          marginTop: "35px",
          lineHeight: "1.8",
          fontSize: "16px",
          color: "#334155",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </article>

    </div>
  );
};

export default BlogDetails;