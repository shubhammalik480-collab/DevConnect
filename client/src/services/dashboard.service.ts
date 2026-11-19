import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/dashboard`;

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