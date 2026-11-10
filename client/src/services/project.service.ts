const API_URL = "http://localhost:5000/api/projects";

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string | null;
  repositoryUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Fetch all projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch projects");
  }

  return result.data;
};

// Add a new project
export const addProject = async (
  project: {
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repositoryUrl?: string;
  }
): Promise<Project> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(project),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add project");
  }

  return result.data;
};