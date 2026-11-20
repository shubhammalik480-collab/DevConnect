import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "../context/useAuth";
import type { User } from "../context/auth.types";
import { API_BASE_URL } from "../config/api";

import {
  getSkills,
  addSkill,
} from "../services/skill.service";

import {
  getProjects,
  addProject,
} from "../services/project.service";

import type { Project } from "../services/project.service";

import "./Profile.css";

interface Skill {
  id: string;
  name: string;
  level: string | null;
}

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [image, setImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectRepositoryUrl, setProjectRepositoryUrl] = useState("");

  const [addingProject, setAddingProject] = useState(false);
  const [projectError, setProjectError] = useState("");

  // Fetch Skills
  const fetchSkills = useCallback(async () => {
    try {
      setSkillsLoading(true);
      setSkillError("");

      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      setSkillError(
        error instanceof Error
          ? error.message
          : "Failed to fetch skills"
      );
    } finally {
      setSkillsLoading(false);
    }
  }, []);

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      setProjectError("");

      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      setProjectError(
        error instanceof Error
          ? error.message
          : "Failed to fetch projects"
      );
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSkills();
    void fetchProjects();
  }, [fetchSkills, fetchProjects]);

  // Add Skill
  const handleAddSkill = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!skillName.trim()) {
      setSkillError("Please enter a skill name");
      return;
    }

    try {
      setAddingSkill(true);
      setSkillError("");

      const newSkill = await addSkill(
        skillName.trim(),
        skillLevel
      );

      setSkills((previous) => [newSkill, ...previous]);
      setSkillName("");
      setSkillLevel("Intermediate");
    } catch (error) {
      setSkillError(
        error instanceof Error
          ? error.message
          : "Failed to add skill"
      );
    } finally {
      setAddingSkill(false);
    }
  };

  // Add Project
  const handleAddProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectTitle.trim() || !projectDescription.trim()) {
      setProjectError("Title and description are required");
      return;
    }

    try {
      setAddingProject(true);
      setProjectError("");

      const newProject = await addProject({
        title: projectTitle.trim(),
        description: projectDescription.trim(),

        techStack: projectTechStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),

        liveUrl: projectLiveUrl.trim() || undefined,

        repositoryUrl: projectRepositoryUrl.trim() || undefined,
      });

      setProjects((previous) => [newProject, ...previous]);

      setProjectTitle("");
      setProjectDescription("");
      setProjectTechStack("");
      setProjectLiveUrl("");
      setProjectRepositoryUrl("");
    } catch (error) {
      setProjectError(
        error instanceof Error
          ? error.message
          : "Failed to add project"
      );
    } finally {
      setAddingProject(false);
    }
  };

  // Edit Profile
  const handleEdit = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setLocation(user?.location || "");
    setImage(null);
    setError("");
    setIsEditing(true);
  };

  // Save Profile
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            bio,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile update failed"
        );
      }

      let updatedUser: User = {
        ...user!,
        ...data.data,
      };

      // Upload Profile Image
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const imageResponse = await fetch(
          `${API_BASE_URL}/users/profile/image`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            imageData.message || "Image upload failed"
          );
        }

        updatedUser = {
          ...updatedUser,
          ...imageData.data,
        };
      }

      updateUser(updatedUser);

      setIsEditing(false);
      setImage(null);

      alert("Profile updated successfully!");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-content">

        {/* Page Heading */}
        <header className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              YOUR DEVELOPER IDENTITY
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your profile, showcase your skills and
              highlight the projects you've built.
            </p>
          </div>

          <button
            className="profile-edit-btn"
            onClick={handleEdit}
          >
            ✎ Edit Profile
          </button>
        </header>

        {/* Profile Hero */}
        <section className="profile-hero">

          <div className="profile-cover">
            <span className="profile-cover-code">
              {"</>"}
            </span>
          </div>

          <div className="profile-hero-content">

            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-info">

              <div className="profile-name-row">
                <h2>{user.name}</h2>
                <span className="profile-member-badge">
                  ✓ DevConnect Member
                </span>
              </div>

              <p className="profile-email">
                {user.email}
              </p>

              <p className="profile-bio">
                {user.bio || "Add a bio to tell the community about yourself."}
              </p>

              <p className="profile-location">
                📍 {user.location || "Location not added"}
              </p>

            </div>

          </div>

          {/* Profile Statistics */}
          <div className="profile-statistics">

            <div className="profile-stat">
              <strong>{projects.length}</strong>
              <span>Projects</span>
            </div>

            <div className="profile-stat">
              <strong>{skills.length}</strong>
              <span>Skills</span>
            </div>

            <div className="profile-stat">
              <strong>{projects.length + skills.length}</strong>
              <span>Contributions</span>
            </div>

          </div>

        </section>

        {/* Edit Profile Form */}
        {isEditing && (
          <section className="profile-section">

            <div className="profile-section-heading">
              <div>
                <span className="profile-eyebrow">
                  PERSONAL INFORMATION
                </span>
                <h2>Edit Your Profile</h2>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handleSave}
            >

              <div className="profile-form-grid">

                <div className="profile-form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                </div>

                <div className="profile-form-group full-width">
                  <label>Bio</label>

                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    rows={4}
                  />
                </div>

                <div className="profile-form-group full-width">
                  <label>Profile Picture</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                  />

                  {image && (
                    <small className="profile-file-name">
                      Selected: {image.name}
                    </small>
                  )}
                </div>

              </div>

              {error && (
                <p className="profile-error">{error}</p>
              )}

              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="profile-primary-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>
          </section>
        )}

        {/* Skills Section */}
        <section className="profile-section">

          <div className="profile-section-heading">
            <div>
              <span className="profile-eyebrow">
                WHAT I WORK WITH
              </span>

              <h2>My Skills</h2>

              <p>
                Showcase the technologies and tools you know.
              </p>
            </div>

            <span className="profile-count">
              {skills.length} Skills
            </span>
          </div>

          <form
            className="profile-add-form"
            onSubmit={handleAddSkill}
          >

            <input
              type="text"
              placeholder="Enter skill (e.g. C++, React)"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />

            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              type="submit"
              className="profile-primary-btn"
              disabled={addingSkill}
            >
              {addingSkill ? "Adding..." : "+ Add Skill"}
            </button>

          </form>

          {skillError && (
            <p className="profile-error">{skillError}</p>
          )}

          {skillsLoading ? (
            <p className="profile-muted">Loading skills...</p>
          ) : skills.length === 0 ? (
            <div className="profile-empty">
              <span>✦</span>
              <h3>No skills added yet</h3>
              <p>Add your first skill to showcase your expertise.</p>
            </div>
          ) : (

            <div className="skills-grid">

              {skills.map((skill) => (
                <article className="skill-card" key={skill.id}>

                  <div className="skill-card-icon">✦</div>

                  <div>
                    <h3>{skill.name}</h3>
                    <p>{skill.level || "Level not specified"}</p>
                  </div>

                </article>
              ))}

            </div>

          )}

        </section>

        {/* Projects Section */}
        <section className="profile-section">

          <div className="profile-section-heading">
            <div>
              <span className="profile-eyebrow">
                BUILT WITH PASSION
              </span>

              <h2>My Projects</h2>

              <p>
                Share your work and let the community explore your projects.
              </p>
            </div>

            <span className="profile-count">
              {projects.length} Projects
            </span>
          </div>

          <form
            className="profile-project-form"
            onSubmit={handleAddProject}
          >

            <div className="profile-form-group">
              <label>Project Title</label>

              <input
                type="text"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>

            <div className="profile-form-group">
              <label>Project Description</label>

              <textarea
                placeholder="Describe your project..."
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
                rows={3}
                required
              />
            </div>

            <div className="profile-form-group">
              <label>Tech Stack</label>

              <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={projectTechStack}
                onChange={(e) =>
                  setProjectTechStack(e.target.value)
                }
              />

              <small>Separate technologies with commas.</small>
            </div>

            <div className="profile-form-grid">

              <div className="profile-form-group">
                <label>Live Project URL</label>

                <input
                  type="url"
                  placeholder="https://example.com"
                  value={projectLiveUrl}
                  onChange={(e) =>
                    setProjectLiveUrl(e.target.value)
                  }
                />
              </div>

              <div className="profile-form-group">
                <label>GitHub Repository</label>

                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={projectRepositoryUrl}
                  onChange={(e) =>
                    setProjectRepositoryUrl(e.target.value)
                  }
                />
              </div>

            </div>

            {projectError && (
              <p className="profile-error">{projectError}</p>
            )}

            <button
              type="submit"
              className="profile-primary-btn"
              disabled={addingProject}
            >
              {addingProject ? "Adding Project..." : "+ Add Project"}
            </button>

          </form>

          {/* Project Cards */}
          {projectsLoading ? (
            <p className="profile-muted">Loading projects...</p>
          ) : projects.length === 0 ? (

            <div className="profile-empty">
              <span>⌘</span>
              <h3>No projects added yet</h3>
              <p>Your projects will appear here once you add them.</p>
            </div>

          ) : (

            <div className="projects-grid">

              {projects.map((project) => (
                <article
                  className="project-card"
                  key={project.id}
                >

                  <div className="project-card-icon">
                    {"</>"}
                  </div>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="project-tags">

                    {project.techStack.map((tech, index) => (
                      <span key={`${project.id}-${index}`}>
                        {tech}
                      </span>
                    ))}

                  </div>

                  <div className="project-links">

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo ↗
                      </a>
                    )}

                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
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

        <footer className="profile-footer">
          Made for developers, built for connections. ✦
        </footer>

      </div>
    </main>
  );
};

export default Profile;