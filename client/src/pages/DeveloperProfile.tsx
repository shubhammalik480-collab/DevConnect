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

import { useAuth } from "../context/useAuth";

import "./DeveloperProfile.css";

const DeveloperProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [developer, setDeveloper] = useState<DeveloperData | null>(null);
  const [skills, setSkills] = useState<SkillWithEndorsements[]>([]);
  const [mutualConnections, setMutualConnections] = useState<ConnectionDeveloper[]>([]);

  const [loading, setLoading] = useState(true);
  const [mutualLoading, setMutualLoading] = useState(true);
  const [endorsementLoading, setEndorsementLoading] = useState(true);

  const [error, setError] = useState("");
  const [mutualError, setMutualError] = useState("");
  const [endorsementError, setEndorsementError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [processingSkillId, setProcessingSkillId] = useState<string | null>(null);

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

        setEndorsementLoading(true);
        setEndorsementError("");

        try {
          const endorsementData = await getUserSkillsWithEndorsements(data.id);
          setSkills(endorsementData);
        } catch (err) {
          setEndorsementError(
            err instanceof Error ? err.message : "Failed to load endorsements"
          );
        } finally {
          setEndorsementLoading(false);
        }

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
            err instanceof Error ? err.message : "Failed to load mutual connections"
          );
        } finally {
          setMutualLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load developer profile"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchDeveloper();
  }, [id, user?.id]);

  const handleEndorse = async (skillId: string) => {
    if (!developer) return;

    try {
      setProcessingSkillId(skillId);
      setActionError("");
      setSuccessMessage("");

      await endorseSkill(skillId);

      const updatedSkills = await getUserSkillsWithEndorsements(developer.id);
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

  const handleRemoveEndorsement = async (skillId: string) => {
    if (!developer) return;

    try {
      setProcessingSkillId(skillId);
      setActionError("");
      setSuccessMessage("");

      await removeEndorsement(skillId);

      const updatedSkills = await getUserSkillsWithEndorsements(developer.id);
      setSkills(updatedSkills);

      setSuccessMessage("Endorsement removed successfully!");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to remove endorsement"
      );
    } finally {
      setProcessingSkillId(null);
    }
  };

  const getAvatar = (name: string, avatar?: string | null) =>
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;

  if (loading) {
    return (
      <div className="developer-profile-state">
        <div className="developer-spinner" />
        <h3>Loading developer profile...</h3>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="developer-profile-state">
        <h2>{error || "Developer not found"}</h2>
        <Link to="/developers" className="developer-back-btn">
          Back to Developers
        </Link>
      </div>
    );
  }

  const totalEndorsements = skills.reduce(
    (total, skill) => total + skill._count.endorsements,
    0
  );

  const isOwnProfile = developer.id === user?.id;

  const statistics = [
    { label: "Technical Skills", value: skills.length, icon: "✦" },
    { label: "Projects", value: developer._count.projects, icon: "⌘" },
    { label: "Blog Posts", value: developer._count.blogPosts, icon: "▤" },
    { label: "Mutual Connections", value: mutualConnections.length, icon: "♧" },
    { label: "Endorsements", value: totalEndorsements, icon: "★" },
  ];

  return (
    <main className="developer-profile-page">
      <div className="developer-profile-container">

        <div className="developer-profile-top">
          <Link to="/developers" className="developer-back-link">
            ← Back to Developers
          </Link>

          <span className="developer-top-label">
            DEVCONNECT COMMUNITY
          </span>
        </div>

        {/* PROFILE HEADER */}

        <section className="developer-hero-card">
          <div className="developer-cover">
            <span className="developer-cover-code">&lt;/&gt;</span>
          </div>

          <div className="developer-identity">
            <img
              src={getAvatar(developer.name, developer.avatar)}
              alt={developer.name}
              className="developer-profile-avatar"
            />

            <div className="developer-identity-info">
              <div className="developer-name-row">
                <h1>{developer.name}</h1>
                <span className="developer-member-badge">
                  ✓ DevConnect Member
                </span>
              </div>

              <p className="developer-profile-location">
                📍 {developer.location || "Location not added"}
              </p>

              <p className="developer-profile-bio">
                {developer.bio || "This developer hasn't added a bio yet."}
              </p>
            </div>
          </div>

          <div className="developer-hero-footer">
            <span>Building connections. Sharing knowledge.</span>
            <span className="developer-online-badge">
              <span /> Community Member
            </span>
          </div>
        </section>

        {/* STATISTICS */}

        <section className="developer-stats-grid">
          {statistics.map((item, index) => (
            <div className="developer-stat-card" key={item.label}>
              <div className={`developer-stat-icon stat-color-${index}`}>
                {item.icon}
              </div>

              <div>
                <h2>{item.value}</h2>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* MUTUAL CONNECTIONS */}

        {!isOwnProfile && (
          <section className="developer-section">
            <div className="developer-section-heading">
              <div>
                <span className="developer-eyebrow">YOUR NETWORK</span>
                <h2>Mutual Connections</h2>
                <p>People you both are connected with.</p>
              </div>

              <span className="developer-section-count">
                {mutualConnections.length}
              </span>
            </div>

            {mutualLoading ? (
              <p className="developer-info-message">
                Loading mutual connections...
              </p>
            ) : mutualError ? (
              <p className="developer-error">{mutualError}</p>
            ) : mutualConnections.length === 0 ? (
              <div className="developer-empty">
                <span>♧</span>
                <h3>No mutual connections yet</h3>
                <p>Your shared network will appear here.</p>
              </div>
            ) : (
              <div className="mutual-connections-grid">
                {mutualConnections.map((person) => (
                  <div className="mutual-connection-card" key={person.id}>
                    <img
                      src={getAvatar(person.name, person.avatar)}
                      alt={person.name}
                      className="mutual-connection-avatar"
                    />

                    <div className="mutual-connection-info">
                      <h4>{person.name}</h4>
                      <p>{person.location || "Location not added"}</p>
                    </div>

                    <span className="mutual-connected-icon">✓</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SKILLS AND ENDORSEMENTS */}

        <section className="developer-section">
          <div className="developer-section-heading">
            <div>
              <span className="developer-eyebrow">TECHNICAL EXPERTISE</span>
              <h2>Skills & Endorsements</h2>
              <p>Explore skills and recognize technical expertise.</p>
            </div>

            <span className="developer-section-count">
              {skills.length} Skills
            </span>
          </div>

          {successMessage && (
            <div className="developer-success">{successMessage}</div>
          )}

          {actionError && (
            <div className="developer-error">{actionError}</div>
          )}

          {endorsementLoading ? (
            <p className="developer-info-message">
              Loading skills and endorsements...
            </p>
          ) : endorsementError ? (
            <p className="developer-error">{endorsementError}</p>
          ) : skills.length === 0 ? (
            <div className="developer-empty">
              <span>✦</span>
              <h3>No skills added yet</h3>
              <p>Skills will appear here when added to the profile.</p>
            </div>
          ) : (
            <div className="developer-skills-list">
              {skills.map((skill, index) => {
                const alreadyEndorsed = skill.endorsements.some(
                  (endorsement) => endorsement.fromUserId === user?.id
                );

                const isProcessing = processingSkillId === skill.id;

                return (
                  <article className="developer-skill-card" key={skill.id}>
                    <div className="developer-skill-main">
                      <div className="developer-skill-icon">✦</div>

                      <div className="developer-skill-info">
                        <h3>
                          {index === 0 && skill._count.endorsements > 0
                            ? "🏆 "
                            : ""}
                          {skill.name}
                        </h3>

                        <span>
                          {skill.level || "Level not specified"}
                        </span>
                      </div>

                      <div className="skill-endorsement-count">
                        👍 {skill._count.endorsements} Endorsements
                      </div>
                    </div>

                    {!isOwnProfile && (
                      <button
                        onClick={() =>
                          alreadyEndorsed
                            ? handleRemoveEndorsement(skill.id)
                            : handleEndorse(skill.id)
                        }
                        disabled={isProcessing}
                        className={
                          alreadyEndorsed
                            ? "endorse-button endorsed"
                            : "endorse-button"
                        }
                      >
                        {isProcessing
                          ? "Processing..."
                          : alreadyEndorsed
                            ? "✓ Endorsed · Remove"
                            : "👍 Endorse Skill"}
                      </button>
                    )}

                    {skill.endorsements.length > 0 && (
                      <div className="skill-endorsers">
                        <h4>Endorsed by</h4>

                        <div className="endorsers-list">
                          {skill.endorsements.map((endorsement) => (
                            <div
                              className="endorser-item"
                              key={endorsement.id}
                            >
                              <img
                                src={getAvatar(
                                  endorsement.fromUser.name,
                                  endorsement.fromUser.avatar
                                )}
                                alt={endorsement.fromUser.name}
                              />

                              <span>{endorsement.fromUser.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* PROJECTS */}

        <section className="developer-section">
          <div className="developer-section-heading">
            <div>
              <span className="developer-eyebrow">BUILT WITH PASSION</span>
              <h2>Projects</h2>
              <p>Explore the work and projects built by this developer.</p>
            </div>

            <span className="developer-section-count">
              {developer.projects.length} Projects
            </span>
          </div>

          {developer.projects.length === 0 ? (
            <div className="developer-empty">
              <span>⌘</span>
              <h3>No projects added yet</h3>
              <p>Projects will appear here when added to the profile.</p>
            </div>
          ) : (
            <div className="developer-projects-grid">
              {developer.projects.map((project) => (
                <article className="developer-project-card" key={project.id}>
                  <div className="project-icon">&lt;/&gt;</div>

                  <h3>{project.title}</h3>

                  <p className="project-description">
                    {project.description}
                  </p>

                  <div className="project-tech-stack">
                    {project.techStack.map((tech, index) => (
                      <span key={`${tech}-${index}`}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo ↗
                      </a>
                    )}

                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub Repository ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="developer-profile-footer">
          Made for developers, built for connections. ✦
        </footer>
      </div>
    </main>
  );
};

export default DeveloperProfile;