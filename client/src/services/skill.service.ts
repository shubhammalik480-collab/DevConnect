const API_URL = "http://localhost:5000/api/skills";

// Fetch all skills
export const getSkills = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch skills");
  }

  return result.data;
};

// Add a new skill
export const addSkill = async (name: string, level: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, level }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add skill");
  }

  return result.data;
};