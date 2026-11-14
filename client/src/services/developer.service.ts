const API_URL = "http://localhost:5000/api/users/developers";
const CONNECTION_API_URL = "http://localhost:5000/api/connections";
const SKILL_API_URL = "http://localhost:5000/api/skills";

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

export interface SkillEndorsement {
  id: string;
  message?: string | null;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  createdAt: string;

  fromUser: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface SkillWithEndorsements {
  id: string;
  name: string;
  level?: string | null;
  userId: string;
  createdAt: string;

  _count: {
    endorsements: number;
  };

  endorsements: SkillEndorsement[];
}

// ==========================================
// GET DEVELOPERS
// ==========================================

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

// ==========================================
// GET DEVELOPER PROFILE
// ==========================================

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

// ==========================================
// SEND CONNECTION REQUEST
// ==========================================

export const sendConnectionRequest = async (
  developerId: string
): Promise<string> => {
  const response = await fetch(
    `${CONNECTION_API_URL}/request/${encodeURIComponent(developerId)}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send connection request");
  }

  return result.message || "Connection request sent successfully";
};

// ==========================================
// GET USER SKILLS WITH ENDORSEMENTS
// ==========================================

export const getUserSkillsWithEndorsements = async (
  userId: string
): Promise<SkillWithEndorsements[]> => {
  const response = await fetch(
    `${SKILL_API_URL}/user/${encodeURIComponent(userId)}/endorsements`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch endorsements");
  }

  return result.data;
};

// ==========================================
// ENDORSE A SKILL
// ==========================================

export const endorseSkill = async (
  skillId: string,
  message?: string
): Promise<SkillEndorsement> => {
  const response = await fetch(
    `${SKILL_API_URL}/endorse/${encodeURIComponent(skillId)}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to endorse skill");
  }

  return result.data;
};

// ==========================================
// REMOVE ENDORSEMENT
// ==========================================

export const removeEndorsement = async (
  skillId: string
): Promise<string> => {
  const response = await fetch(
    `${SKILL_API_URL}/endorse/${encodeURIComponent(skillId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to remove endorsement");
  }

  return result.message;
};