import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

const API_URL = "http://localhost:5000/api";

interface Skill {
  id: string;
  name: string;
  level: string | null;
}

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile states
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");

  const [image, setImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Skills states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");

  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState("");

  // Projects states
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
  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);

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
  };

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);

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
  };

  // Load Skills and Projects
  useEffect(() => {
    fetchSkills();
    fetchProjects();
  }, []);

  // Add Skill
  const handleAddSkill = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

      setSkills((previousSkills) => [
        newSkill,
        ...previousSkills,
      ]);

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
  const handleAddProject = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

        repositoryUrl:
          projectRepositoryUrl.trim() || undefined,
      });

      setProjects((previousProjects) => [
        newProject,
        ...previousProjects,
      ]);

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

  // Open Edit Profile Form
  const handleEdit = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setLocation(user?.location || "");

    setImage(null);
    setError("");

    setIsEditing(true);
  };

  // Save Profile
  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/users/profile`,
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

      // Upload profile image
      if (image) {
        const formData = new FormData();

        formData.append("image", image);

        const imageResponse = await fetch(
          `${API_URL}/users/profile/image`,
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

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  if (!user) {
    return <h2>Loading profile...</h2>;
  }

  return (
    <div className="profile-container">

      {/* Navbar */}
      <nav className="profile-navbar">
        <h2>DevConnect</h2>

        <div>
          <button onClick={() => navigate("/blogs")}>
            Blogs
          </button>

          <button onClick={() => navigate("/developers")}>
            Developers
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="profile-hero">

        <div className="profile-avatar">

          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
            />
          ) : (
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

        </div>

        <div className="profile-info">

          <h1>{user.name}</h1>

          <p>{user.email}</p>

          <p>{user.bio || "No bio added yet."}</p>

          <p>{user.location || "Location not added"}</p>

          <button onClick={handleEdit}>
            Edit Profile
          </button>

        </div>

      </section>

      {/* Edit Profile Form */}
      {isEditing && (

        <section className="profile-section">

          <h2>Edit Your Profile</h2>

          <form onSubmit={handleSave}>

            <div>
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Bio</label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                rows={4}
              />
            </div>

            <div>
              <label>Location</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
              />
            </div>

            <div>
              <label>Profile Picture</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
              />
            </div>

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>

          </form>

        </section>

      )}

      {/* Skills Section */}
      <section className="profile-section">

        <h2>My Skills</h2>

        <form onSubmit={handleAddSkill}>

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
            disabled={addingSkill}
          >
            {addingSkill ? "Adding..." : "Add Skill"}
          </button>

        </form>

        {skillError && (
          <p style={{ color: "red" }}>
            {skillError}
          </p>
        )}

        {skillsLoading ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p>No skills added yet. Add your first skill!</p>
        ) : (

          <div className="skills-grid">

            {skills.map((skill) => (
              <div
                className="skill-card"
                key={skill.id}
              >
                <h3>{skill.name}</h3>

                <p>
                  {skill.level || "Level not specified"}
                </p>
              </div>
            ))}

          </div>

        )}

      </section>

      {/* Projects Section */}
      <section className="profile-section">

        <h2>My Projects</h2>

        <form onSubmit={handleAddProject}>

          <input
            type="text"
            placeholder="Project title"
            value={projectTitle}
            onChange={(e) =>
              setProjectTitle(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Project description"
            value={projectDescription}
            onChange={(e) =>
              setProjectDescription(e.target.value)
            }
            rows={3}
            required
          />

          <input
            type="text"
            placeholder="Tech stack (React, Node.js, MongoDB)"
            value={projectTechStack}
            onChange={(e) =>
              setProjectTechStack(e.target.value)
            }
          />

          <input
            type="url"
            placeholder="Live project URL (optional)"
            value={projectLiveUrl}
            onChange={(e) =>
              setProjectLiveUrl(e.target.value)
            }
          />

          <input
            type="url"
            placeholder="GitHub repository URL (optional)"
            value={projectRepositoryUrl}
            onChange={(e) =>
              setProjectRepositoryUrl(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={addingProject}
          >
            {addingProject ? "Adding..." : "Add Project"}
          </button>

        </form>

        {projectError && (
          <p style={{ color: "red" }}>
            {projectError}
          </p>
        )}

        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects added yet. Add your first project!</p>
        ) : (

          <div className="projects-grid">

            {projects.map((project) => (
              <div
                className="project-card"
                key={project.id}
              >

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
                      Live Demo
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Repository
                    </a>
                  )}

                </div>

              </div>
            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Profile;