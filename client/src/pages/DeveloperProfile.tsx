import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getDeveloperById,
  getUserSkillsWithEndorsements,
  endorseSkill,
  removeEndorsement,
  type DeveloperProfile as DeveloperData,
  type SkillWithEndorsements,
} from "../services/developer.service";

import {
  getMutualConnections,
  type ConnectionDeveloper,
} from "../services/connection.service";

import { useAuth } from "../context/AuthContext";

const DeveloperProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [developer, setDeveloper] = useState<DeveloperData | null>(null);

  const [skills, setSkills] = useState<SkillWithEndorsements[]>([]);

  const [mutualConnections, setMutualConnections] = useState<
    ConnectionDeveloper[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [mutualLoading, setMutualLoading] = useState(true);
  const [endorsementLoading, setEndorsementLoading] = useState(true);

  const [error, setError] = useState("");
  const [mutualError, setMutualError] = useState("");
  const [endorsementError, setEndorsementError] = useState("");
  const [actionError, setActionError] = useState("");

  const [processingSkillId, setProcessingSkillId] = useState<string | null>(
    null
  );

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // FETCH DEVELOPER PROFILE
  // ==========================================

  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!id) {
        setError("Developer ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getDeveloperById(id);
        setDeveloper(data);

        // Fetch skills and endorsements
        setEndorsementLoading(true);
        setEndorsementError("");

        try {
          const endorsementData = await getUserSkillsWithEndorsements(
            data.id
          );

          setSkills(endorsementData);
        } catch (err) {
          setEndorsementError(
            err instanceof Error
              ? err.message
              : "Failed to load endorsements"
          );
        } finally {
          setEndorsementLoading(false);
        }

        // Mutual connections are not requested on own profile.
        if (data.id === user?.id) {
          setMutualConnections([]);
          setMutualLoading(false);
          return;
        }

        setMutualLoading(true);
        setMutualError("");

        try {
          const mutualData = await getMutualConnections(data.id);
          setMutualConnections(mutualData);
        } catch (err) {
          setMutualError(
            err instanceof Error
              ? err.message
              : "Failed to load mutual connections"
          );
        } finally {
          setMutualLoading(false);
        }
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
  }, [id, user?.id]);

  // ==========================================
  // ENDORSE SKILL
  // ==========================================

  const handleEndorse = async (skillId: string) => {
    try {
      setProcessingSkillId(skillId);
      setActionError("");
      setSuccessMessage("");

      await endorseSkill(skillId);

      // Refresh skills and endorsement counts
      const updatedSkills = await getUserSkillsWithEndorsements(
        developer!.id
      );

      setSkills(updatedSkills);
      setSuccessMessage("Skill endorsed successfully!");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to endorse skill"
      );
    } finally {
      setProcessingSkillId(null);
    }
  };

  // ==========================================
  // REMOVE ENDORSEMENT
  // ==========================================

  const handleRemoveEndorsement = async (skillId: string) => {
    try {
      setProcessingSkillId(skillId);
      setActionError("");
      setSuccessMessage("");

      await removeEndorsement(skillId);

      const updatedSkills = await getUserSkillsWithEndorsements(
        developer!.id
      );

      setSkills(updatedSkills);
      setSuccessMessage("Endorsement removed successfully!");
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to remove endorsement"
      );
    } finally {
      setProcessingSkillId(null);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "80px" }}>
        Loading developer profile...
      </h2>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error || !developer) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>{error || "Developer not found"}</h2>
        <Link to="/developers">Back to Developers</Link>
      </div>
    );
  }

  const totalEndorsements = skills.reduce(
    (total, skill) => total + skill._count.endorsements,
    0
  );

  const isOwnProfile = developer.id === user?.id;

  // ==========================================
  // MAIN UI
  // ==========================================

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

        {/* PROFILE HEADER */}

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

        {/* STATISTICS */}

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
              value: skills.length,
            },
            {
              label: "Projects",
              value: developer._count.projects,
            },
            {
              label: "Blog Posts",
              value: developer._count.blogPosts,
            },
            {
              label: "Mutual Connections",
              value: mutualConnections.length,
            },
            {
              label: "Total Endorsements",
              value: totalEndorsements,
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

        {/* MUTUAL CONNECTIONS */}

        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
          }}
        >
          <h2>🤝 Mutual Connections</h2>

          {mutualLoading ? (
            <p style={{ color: "#64748b" }}>
              Loading mutual connections...
            </p>
          ) : mutualError ? (
            <p style={{ color: "#dc2626" }}>{mutualError}</p>
          ) : mutualConnections.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No mutual connections yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {mutualConnections.map((person) => (
                <div
                  key={person.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={
                      person.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        person.name
                      )}&background=random`
                    }
                    alt={person.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <h4 style={{ margin: "0 0 5px", color: "#1e293b" }}>
                      {person.name}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {person.location || "Location not added"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SKILLS AND ENDORSEMENTS */}

        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
          }}
        >
          <h2>🏆 Technical Skills & Endorsements</h2>

          <p style={{ color: "#64748b" }}>
            Skills are ranked according to their endorsement count.
          </p>

          {successMessage && (
            <p
              style={{
                background: "#dcfce7",
                color: "#15803d",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {successMessage}
            </p>
          )}

          {actionError && (
            <p
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {actionError}
            </p>
          )}

          {endorsementLoading ? (
            <p style={{ color: "#64748b" }}>
              Loading skills and endorsements...
            </p>
          ) : endorsementError ? (
            <p style={{ color: "#dc2626" }}>{endorsementError}</p>
          ) : skills.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No skills added yet.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "18px", marginTop: "20px" }}>
              {skills.map((skill, index) => {
                const alreadyEndorsed = skill.endorsements.some(
                  (endorsement) =>
                    endorsement.fromUserId === user?.id
                );

                const isProcessing = processingSkillId === skill.id;

                return (
                  <div
                    key={skill.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "20px",
                      background: "#ffffff",
                    }}
                  >
                    {/* Skill Header */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: "0 0 7px", color: "#1e293b" }}>
                          {index === 0 && skill._count.endorsements > 0
                            ? "🏆 "
                            : ""}
                          {skill.name}
                        </h3>

                        {skill.level && (
                          <span style={{ color: "#64748b", fontSize: "13px" }}>
                            Level: {skill.level}
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          padding: "8px 14px",
                          borderRadius: "20px",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                      >
                        👍 {skill._count.endorsements} Endorsements
                      </span>
                    </div>

                    {/* Endorse Button */}

                    {!isOwnProfile && (
                      <button
                        onClick={() =>
                          alreadyEndorsed
                            ? handleRemoveEndorsement(skill.id)
                            : handleEndorse(skill.id)
                        }
                        disabled={isProcessing}
                        style={{
                          marginTop: "15px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          border: "none",
                          background: alreadyEndorsed
                            ? "#fee2e2"
                            : "#2563eb",
                          color: alreadyEndorsed ? "#dc2626" : "white",
                          fontWeight: "600",
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        {isProcessing
                          ? "Processing..."
                          : alreadyEndorsed
                          ? "✓ Endorsed (Remove)"
                          : "👍 Endorse Skill"}
                      </button>
                    )}

                    {/* Endorsers List */}

                    {skill.endorsements.length > 0 && (
                      <div
                        style={{
                          marginTop: "20px",
                          borderTop: "1px solid #e2e8f0",
                          paddingTop: "15px",
                        }}
                      >
                        <h4 style={{ color: "#334155" }}>
                          Endorsed by
                        </h4>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "15px",
                          }}
                        >
                          {skill.endorsements.map((endorsement) => (
                            <div
                              key={endorsement.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "#f8fafc",
                                padding: "8px 12px",
                                borderRadius: "8px",
                              }}
                            >
                              <img
                                src={
                                  endorsement.fromUser.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    endorsement.fromUser.name
                                  )}&background=random`
                                }
                                alt={endorsement.fromUser.name}
                                style={{
                                  width: "35px",
                                  height: "35px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />

                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#334155",
                                }}
                              >
                                {endorsement.fromUser.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PROJECTS */}

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