import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

import {
  getBlogBySlug,
  updateBlog,
} from "../services/blog.service";

import type { Blog } from "../services/blog.service";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const EditBlog = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) {
          throw new Error("Invalid blog URL");
        }

        const data = await getBlogBySlug(slug);

        setBlog(data);
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt || "");
        setCoverImage(data.coverImage || "");
        setPublished(data.published);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch blog"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Update blog
  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!blog) return;

    if (!title.trim() || !content?.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedBlog = await updateBlog(blog.id, {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim(),
        published,
      });

      navigate(`/blogs/${updatedBlog.slug}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update blog"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading blog...</h2>;
  }

  if (error && !blog) {
    return (
      <div>
        <h2>{error}</h2>
        <button onClick={() => navigate("/blogs")}>
          Back to Blogs
        </button>
      </div>
    );
  }

  if (!blog) {
    return <h2>Blog not found</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Edit Blog</h1>

      <form onSubmit={handleUpdate}>

        <div style={{ marginBottom: "20px" }}>
          <label>Blog Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Blog Excerpt</label>

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Cover Image URL</label>

          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div data-color-mode="light">
          <label>Blog Content</label>

          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="live"
          />
        </div>

        <div style={{ margin: "20px 0" }}>
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {" "}Publish blog
          </label>
        </div>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Blog"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/blogs")}
          disabled={saving}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default EditBlog;