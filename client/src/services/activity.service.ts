import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/activities`;

export interface Activity {
  id: string;
  userId: string;
  actorId: string;
  type: string;
  message: string;
  entityId?: string;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const getActivities = async (): Promise<Activity[]> => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data.data;
};