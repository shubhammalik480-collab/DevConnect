import "dotenv/config";
import { createServer } from "http";

import app from "./app";
import { initializeSocket } from "./config/socket";

const PORT = Number(process.env.PORT) || 5000;

// Create HTTP Server
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});