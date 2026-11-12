const API_URL = "http://localhost:5000/api/users/developers";

export interface Developer {
  id: string;
  name: string;
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  createdAt: string;

  skills: {
    id: string;
    name: string;
    level?: string | null;
  }[];

  _count: {
    projects: number;
    blogPosts: number;
  };
}

export interface DeveloperProfile extends Developer {
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string | null;
    repositoryUrl?: string | null;
    createdAt: string;
  }[];
}

export const getDevelopers = async (
  search = ""
): Promise<Developer[]> => {
  const query = search.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";

  const response = await fetch(`${API_URL}${query}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch developers");
  }

  return result.data;
};

export const getDeveloperById = async (
  id: string
): Promise<DeveloperProfile> => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch developer profile");
  }

  return result.data;
};