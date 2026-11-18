import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalBlogs: number;
  totalConnections: number;
  pendingRequests: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get(`${API_URL}/stats`, {
    withCredentials: true,
  });

  return response.data.data;
};