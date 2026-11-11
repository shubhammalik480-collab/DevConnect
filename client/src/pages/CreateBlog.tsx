import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { createBlog } from "../services/blog.service";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim() || !content?.trim()) {
      setError("Title and blog content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const blog = await createBlog({
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        published,
      });

      navigate(`/blogs/${blog.slug}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Create New Blog</h1>

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "20px" }}>
          <label>Blog Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
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
            placeholder="Write a short description..."
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Cover Image URL (Optional)</label>

          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div data-color-mode="light">
          <label>Blog Content (Markdown)</label>

          <div style={{ marginTop: "10px" }}>
            <MDEditor
              value={content}
              onChange={setContent}
              height={400}
              preview="live"
            />
          </div>
        </div>

        <div style={{ margin: "20px 0" }}>
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {" "}Publish blog immediately
          </label>
        </div>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : published ? "Publish Blog" : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/blogs")}
          style={{
            padding: "12px 25px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default CreateBlog;