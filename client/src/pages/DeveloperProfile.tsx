import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getDeveloperById,
  type DeveloperProfile as DeveloperData,
} from "../services/developer.service";

const DeveloperProfile = () => {
  const { id } = useParams<{ id: string }>();

  const [developer, setDeveloper] = useState<DeveloperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        if (!id) {
          throw new Error("Developer ID is missing");
        }

        setLoading(true);
        setError("");

        const data = await getDeveloperById(id);
        setDeveloper(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load developer profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "80px" }}>
      Loading developer profile...
    </h2>;
  }

  if (error || !developer) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>{error || "Developer not found"}</h2>
        <Link to="/developers">Back to Developers</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        <Link
          to="/developers"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Developers
        </Link>

        {/* Profile Header */}
        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            marginTop: "25px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src={
              developer.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                developer.name
              )}&background=random`
            }
            alt={developer.name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <h1 style={{ color: "#1e293b", marginBottom: "8px" }}>
            {developer.name}
          </h1>

          <p style={{ color: "#64748b" }}>
            📍 {developer.location || "Location not added"}
          </p>

          <p
            style={{
              color: "#475569",
              maxWidth: "600px",
              margin: "20px auto",
              lineHeight: "1.7",
            }}
          >
            {developer.bio || "No bio available"}
          </p>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          {[
            {
              label: "Total Skills",
              value: developer.skills.length,
            },
            {
              label: "Projects",
              value: developer._count.projects,
            },
            {
              label: "Blog Posts",
              value: developer._count.blogPosts,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h2 style={{ color: "#2563eb", fontSize: "30px" }}>
                {item.value}
              </h2>

              <p style={{ color: "#64748b" }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
          }}
        >
          <h2>Technical Skills</h2>

          {developer.skills.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No skills added yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {developer.skills.map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "10px 16px",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{skill.name}</strong>

                  {skill.level && (
                    <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                      ({skill.level})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Projects */}
        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
          }}
        >
          <h2>Projects</h2>

          {developer.projects.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No projects added yet.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "18px" }}>
              {developer.projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  <h3>{project.title}</h3>

                  <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                    {project.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      margin: "15px 0",
                    }}
                  >
                    {project.techStack.map((tech, index) => (
                      <span
                        key={`${tech}-${index}`}
                        style={{
                          background: "#f1f5f9",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo
                      </a>
                    )}

                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default DeveloperProfile;