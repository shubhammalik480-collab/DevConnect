import { lazy, Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getBlogBySlug,
  updateBlog,
} from "../services/blog.service";

import type { Blog } from "../services/blog.service";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./EditBlog.css";

const MDEditor = lazy(
  () => import("@uiw/react-md-editor/nohighlight")
);

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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch blog"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchBlog();
  }, [slug]);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update blog"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-loading">
        <div className="edit-spinner"></div>
        <h2>Loading your article...</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="edit-error-page">
        <h2>{error || "Blog not found"}</h2>
        <button onClick={() => navigate("/blogs")}>
          Back to Blogs
        </button>
      </div>
    );
  }

  const wordCount = content?.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  return (
    <main className="edit-blog-page">

      {/* Header */}
      <header className="edit-page-header">
        <div>
          <span className="edit-eyebrow">UPDATE YOUR KNOWLEDGE</span>
          <h1>Edit Your Article</h1>
          <p>Improve your ideas and keep your community updated.</p>
        </div>

        <button
          className="edit-back-btn"
          onClick={() => navigate("/blogs")}
        >
          ← Back to Blogs
        </button>
      </header>

      <form onSubmit={handleUpdate}>

        <div className="edit-layout">

          {/* Main Editor */}
          <div className="edit-main-column">

            {/* Article Details */}
            <section className="edit-panel">

              <span className="edit-eyebrow">ARTICLE DETAILS</span>

              <h2>Give your article a voice</h2>

              <p className="edit-panel-description">
                Update your title and introduction.
              </p>

              <div className="edit-form-group">
                <label>Article Title <span>*</span></label>

                <input
                  type="text"
                  value={title}
                  maxLength={200}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your article title"
                  required
                />

                <small>{title.length}/200 characters</small>
              </div>

              <div className="edit-form-group">
                <label>Short Description</label>

                <textarea
                  value={excerpt}
                  maxLength={300}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="What will readers learn from your article?"
                  rows={3}
                />

                <small>{excerpt.length}/300 characters</small>
              </div>

              <div className="edit-form-group">
                <label>
                  Cover Image URL <span className="optional-label">Optional</span>
                </label>

                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/cover-image.jpg"
                />
              </div>

            </section>

            {/* Markdown Editor */}
            <section className="edit-panel edit-story-panel">

              <span className="edit-eyebrow">YOUR STORY</span>

              <div className="edit-story-heading">
                <div>
                  <h2>Update your article</h2>
                  <p className="edit-panel-description">
                    Use Markdown to format headings, code, lists and links.
                  </p>
                </div>

                <span className="edit-word-count">
                  {wordCount} words
                </span>
              </div>

              <div className="edit-markdown-editor" data-color-mode="light">
                <Suspense fallback={<p>Loading Markdown Editor...</p>}>
                  <MDEditor
                    value={content}
                    onChange={setContent}
                    height={400}
                    preview="live"
                  />
                </Suspense>
              </div>

              <p className="edit-editor-tip">
                Tip: Use headings, code blocks and bullet points to make
                your article easier to read.
              </p>

            </section>

          </div>

          {/* Sidebar */}
          <aside className="edit-sidebar">

            <section className="edit-panel edit-publish-panel">

              <span className="edit-eyebrow">PUBLISH SETTINGS</span>

              <h2>Ready to update?</h2>

              <p className="edit-panel-description">
                Choose whether to publish your article now or save it
                as a draft.
              </p>

              <div className={`edit-status ${published ? "is-published" : ""}`}>
                <span></span>
                {published ? "Currently published" : "Saved as draft"}
              </div>

              <label className="edit-toggle">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />

                <span className="edit-toggle-slider"></span>

                <span>Publish immediately</span>
              </label>

              <div className="edit-summary">

                <div>
                  <span>Title</span>
                  <strong>{title.trim() ? "Added" : "Not added"}</strong>
                </div>

                <div>
                  <span>Content</span>
                  <strong>{content?.trim() ? "Added" : "Empty"}</strong>
                </div>

                <div>
                  <span>Cover image</span>
                  <strong>{coverImage.trim() ? "Added" : "Optional"}</strong>
                </div>

              </div>

              {error && (
                <p className="edit-error-message">{error}</p>
              )}

              <button
                type="submit"
                className="edit-submit-btn"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : published
                    ? "Update & Publish →"
                    : "Save Changes →"}
              </button>

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() => navigate("/blogs")}
                disabled={saving}
              >
                Cancel
              </button>

            </section>

            {/* Writing Tips */}
            <section className="edit-panel edit-tips-panel">

              <div className="edit-tips-icon">✦</div>

              <h2>Writing Tips</h2>

              <ul>
                <li>Choose a clear and meaningful title.</li>
                <li>Keep paragraphs short and readable.</li>
                <li>Add code examples when explaining technical concepts.</li>
                <li>Share your own experience and insights.</li>
              </ul>

            </section>

          </aside>

        </div>
      </form>

      <footer className="edit-footer">
        Made for developers, built for connections. ✦
      </footer>

    </main>
  );
};

export default EditBlog;