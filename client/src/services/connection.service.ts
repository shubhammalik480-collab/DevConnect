const API_URL = "http://localhost:5000/api/connections";

export interface ConnectionDeveloper {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar: string | null;
}

export interface ConnectionRequest {
  id: string;
  requester: ConnectionDeveloper;
  receiver: ConnectionDeveloper;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface AcceptedConnection {
  id: string;
  connectedAt: string;
  developer: ConnectionDeveloper;
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

export const getPendingRequests = async (): Promise<ConnectionRequest[]> => {
  const result = await apiRequest("/pending");
  return result.data;
};

export const getSentRequests = async (): Promise<ConnectionRequest[]> => {
  const result = await apiRequest("/sent");
  return result.data;
};

export const getMyConnections = async (): Promise<AcceptedConnection[]> => {
  const result = await apiRequest("");
  return result.data;
};

export const acceptConnectionRequest = async (id: string) => {
  return apiRequest(`/${id}/accept`, {
    method: "PATCH",
  });
};

export const rejectConnectionRequest = async (id: string) => {
  return apiRequest(`/${id}/reject`, {
    method: "PATCH",
  });
};

export const getMutualConnections = async (
  developerId: string
): Promise<ConnectionDeveloper[]> => {
  const result = await apiRequest(`/mutual/${developerId}`);
  return result.data;
};