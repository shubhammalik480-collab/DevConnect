import { createContext } from "react";
import type { SocketContextType } from "./socket.types";

export const SocketContext = createContext<
  SocketContextType | undefined
>(undefined);