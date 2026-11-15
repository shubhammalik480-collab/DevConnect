import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

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

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  clearNotifications: () => void;
}

const SocketContext = createContext<
  SocketContextType | undefined
>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({
  children,
}: SocketProviderProps) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setNotifications([]);
      return;
    }

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("notification", (notification: Notification) => {
      console.log("New notification:", notification);

      setNotifications((previous) => [
        notification,
        ...previous,
      ]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user?.id]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used within SocketProvider"
    );
  }

  return context;
};