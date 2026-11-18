import type { Socket } from "socket.io-client";

export interface Notification {
  id: string;
  type:
    | "CONNECTION_REQUEST"
    | "CONNECTION_ACCEPTED"
    | "SKILL_ENDORSED";
  message: string;
  fromUserId: string;
  createdAt: string;
  skillId?: string;
  skillName?: string;
}

export interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  clearNotifications: () => void;
}