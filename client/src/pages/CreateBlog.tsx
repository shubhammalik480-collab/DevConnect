import { lazy, Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createBlog } from "../services/blog.service";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./CreateBlog.css";

const MDEditor = lazy(
  () => import("@uiw/react-md-editor/nohighlight")
);

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>(
    "## Introduction\n\nShare your knowledge with the community."
  );
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // Create blog
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content?.trim()) {
      setError("Title and blog content are required.");
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create blog."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-blog-page">

      {/* Header */}
      <header className="create-blog-header">
        <div>
          <span className="section-eyebrow">
            SHARE YOUR KNOWLEDGE
          </span>

          <h1>Create an Article</h1>

          <p>
            Turn your ideas into something valuable for the developer
            community.
          </p>
        </div>

        <button
          type="button"
          className="back-to-blogs"
          onClick={() => navigate("/blogs")}
        >
          ← Back to Blogs
        </button>
      </header>

      <form onSubmit={handleSubmit} className="create-blog-layout">

        {/* Main Content */}
        <div className="create-blog-main">

          {/* Article Details */}
          <section className="create-blog-card">
            <span className="section-eyebrow">
              ARTICLE DETAILS
            </span>

            <h2>Give your article a voice</h2>

            <p className="section-description">
              Start with a clear title and a short introduction.
            </p>

            <div className="form-group">
              <label htmlFor="blog-title">
                Article Title <span>*</span>
              </label>

              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Getting Started with React"
                maxLength={200}
                required
              />

              <small>{title.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="blog-excerpt">
                Short Description
              </label>

              <textarea
                id="blog-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="What will readers learn from your article?"
                rows={3}
                maxLength={300}
              />

              <small>{excerpt.length}/300 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="cover-image">
                Cover Image URL
                <span className="optional">Optional</span>
              </label>

              <input
                id="cover-image"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/cover-image.jpg"
              />
            </div>
          </section>

          {/* Markdown Editor */}
          <section className="create-blog-card editor-card">
            <span className="section-eyebrow">
              YOUR STORY
            </span>

            <h2>Write your article</h2>

            <p className="section-description">
              Use Markdown to format headings, code, lists and links.
            </p>

            <div className="editor-word-count">
              {content?.trim()
                ? content.trim().split(/\s+/).length
                : 0}{" "}
              words
            </div>

            <div
              data-color-mode="light"
              className="markdown-editor-wrapper"
            >
              {/* Mobile Write / Preview Tabs */}
              {isMobile && (
                <div className="mobile-editor-tabs">
                  <button
                    type="button"
                    className={!mobilePreview ? "active" : ""}
                    onClick={() => setMobilePreview(false)}
                  >
                    ✏️ Write
                  </button>

                  <button
                    type="button"
                    className={mobilePreview ? "active" : ""}
                    onClick={() => setMobilePreview(true)}
                  >
                    👁 Preview
                  </button>
                </div>
              )}

              <Suspense
                fallback={
                  <div className="editor-loading">
                    Loading Markdown Editor...
                  </div>
                }
              >
                <MDEditor
                  value={content}
                  onChange={setContent}
                  height={400}
                  preview={
                    isMobile
                      ? mobilePreview
                        ? "preview"
                        : "edit"
                      : "live"
                  }
                  hideToolbar={false}
                  visibleDragbar={false}
                />
              </Suspense>
            </div>

            <p className="editor-tip">
              Tip: Use headings, code blocks and bullet points to make
              your article easier to read.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="create-blog-sidebar">

          {/* Publish Settings */}
          <section className="create-blog-card publish-card">
            <span className="section-eyebrow">
              PUBLISH SETTINGS
            </span>

            <h2>Ready to share?</h2>

            <p className="section-description">
              Choose whether to publish your article now or save it as
              a draft.
            </p>

            <div className="draft-status">
              <span>{published ? "🟢" : "🟠"}</span>
              {published ? "Ready to publish" : "Saved as draft"}
            </div>

            <label className="publish-toggle">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />

              <span className="toggle-slider"></span>

              Publish immediately
            </label>

            <div className="publish-summary">
              <div>
                <span>Title</span>
                <strong>
                  {title.trim() ? "Added" : "Not added"}
                </strong>
              </div>

              <div>
                <span>Content</span>
                <strong>
                  {content?.trim() ? "Added" : "Empty"}
                </strong>
              </div>

              <div>
                <span>Cover image</span>
                <strong>
                  {coverImage.trim() ? "Added" : "Optional"}
                </strong>
              </div>
            </div>

            {error && (
              <p className="create-blog-error">{error}</p>
            )}

            <button
              type="submit"
              className="publish-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : published
                  ? "Publish Article →"
                  : "Save as Draft →"}
            </button>

            <button
              type="button"
              className="cancel-blog-btn"
              onClick={() => navigate("/blogs")}
              disabled={loading}
            >
              Cancel
            </button>
          </section>

          {/* Writing Tips */}
          <section className="create-blog-card writing-tips">
            <div className="tips-icon">✦</div>

            <h2>Writing Tips</h2>

            <ul>
              <li>Choose a clear and meaningful title.</li>
              <li>Keep paragraphs short and readable.</li>
              <li>
                Add code examples when explaining technical concepts.
              </li>
              <li>Share your own experience and insights.</li>
            </ul>
          </section>
        </aside>
      </form>

      <footer className="create-blog-footer">
        Made for developers, built for connections. ✦
      </footer>
    </main>
  );
};

export default CreateBlog;