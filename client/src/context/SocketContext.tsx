import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./useAuth";
import { SocketContext } from "./socket-context";

import type {
  Notification,
  SocketContextType,
} from "./socket.types";

interface SocketProviderProps {
  children: ReactNode;
}

interface NotificationsState {
  userId: string;
  items: Notification[];
}

export const SocketProvider = ({
  children,
}: SocketProviderProps) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [socket, setSocket] = useState<SocketContextType["socket"]>(
    null
  );

  const [notificationsState, setNotificationsState] =
    useState<NotificationsState>({
      userId: "",
      items: [],
    });

  const notifications =
    notificationsState.userId === userId
      ? notificationsState.items
      : [];

  useEffect(() => {
    if (!userId) {
      return;
    }

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("notification", (notification: Notification) => {
      console.log("New notification:", notification);

      setNotificationsState((previous) => ({
        userId,
        items:
          previous.userId === userId
            ? [notification, ...previous.items]
            : [notification],
      }));
    });

    newSocket.on("disconnect", () => {
      setSocket((currentSocket) =>
        currentSocket === newSocket ? null : currentSocket
      );
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const clearNotifications = () => {
    if (!userId) return;

    setNotificationsState({
      userId,
      items: [],
    });
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