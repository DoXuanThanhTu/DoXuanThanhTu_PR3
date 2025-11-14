import express from "express";
import dotenv from "dotenv";
import { connectDB } from "@repo/database";
import cors from "cors";

import movieRoutes from "./routes/v1/movie.route.js";
import episodeRoutes from "./routes/v1/episode.route.js";
import serverRoutes from "./routes/v1/server.routes.js";
import watchRoute from "./routes/v1/watch.route.js";
import franchiseRoutes from "./routes/v1/franchise.routes.js";

dotenv.config();
const app = express();

/* Middleware */
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);

/* Routes */
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/episodes", episodeRoutes);
app.use("/api/v1/servers", serverRoutes);
app.use("/api/v1/watch", watchRoute);
app.use("/api/v1/franchises", franchiseRoutes);

/* Start Server */
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Movie service connected to MongoDB");

    const PORT = process.env.PORT || 4002;
    app.listen(PORT, () => {
      console.log(`Movie service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start Movie service:", err);
    process.exit(1);
  }
};

startServer();
