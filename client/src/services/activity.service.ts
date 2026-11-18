import axios from "axios";

const API_URL = "http://localhost:5000/api/activities";

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